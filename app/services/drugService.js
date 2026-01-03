import fetch from "node-fetch";
import { tissueDB, drugDB } from "../config/DB.js";

/* ---------------- HELPERS ---------------- */

export async function getClinicalUniprotsForDrug(drugName) {
  const drug = await drugDB.collection("clinicaltargets").findOne({ generic_name: drugName });
  if (!drug || !Array.isArray(drug.targets)) return [];

  const uniprots = new Set();
  for (const t of drug.targets) {
    if (t.organism !== "Homo sapiens") continue;

    const tdlValues = typeof t.tdl === "string" ? t.tdl.split("|") : [];
    if (!tdlValues.includes("Tclin")) continue;

    if (typeof t.accession === "string") {
      t.accession.split("|").map(a => a.trim()).filter(Boolean).forEach(a => uniprots.add(a));
    }
  }

  return [...uniprots];
}

export async function mapUniProtToEnsembl(uniprots) {
  if (!uniprots.length) return [];

  const batchSize = 100;
  const concurrency = 3;
  const ensembls = new Set();

  const batches = [];
  for (let i = 0; i < uniprots.length; i += batchSize) {
    batches.push(uniprots.slice(i, i + batchSize));
  }

  const mapBatch = async (batch) => {
    const runRes = await fetch("https://rest.uniprot.org/idmapping/run", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        from: "UniProtKB_AC-ID",
        to: "Ensembl",
        ids: batch.join(",")
      })
    });

    const { jobId } = await runRes.json();
    if (!jobId) throw new Error("UniProt mapping failed");

    let status = "RUNNING";
    while (status === "RUNNING") {
      await new Promise(r => setTimeout(r, 1000));
      const statusRes = await fetch(`https://rest.uniprot.org/idmapping/status/${jobId}`);
      const statusJson = await statusRes.json();
      status = statusJson.jobStatus || "FINISHED";
    }

    const resultRes = await fetch(`https://rest.uniprot.org/idmapping/results/${jobId}`);
    const resultJson = await resultRes.json();

    resultJson.results?.forEach(r => {
      if (r.to?.startsWith("ENSG")) ensembls.add(r.to.split(".")[0]);
    });
  };

  const queue = [...batches];
  const workers = new Array(concurrency).fill(null).map(async () => {
    while (queue.length) await mapBatch(queue.shift());
  });

  await Promise.all(workers);
  return [...ensembls];
}

export async function getOrgansFromMongoBatch(ensembls) {
  if (!ensembls.length) return {};

  const rows = await tissueDB.collection("hpa_normal_tissue")
    .find({ ensembl: { $in: ensembls } })
    .toArray();

  const rank = { "Not detected": 0, "Low": 1, "Medium": 2, "High": 3 };
  const organs = {};

  for (const r of rows) {
    if (!organs[r.tissue] || rank[r.level] > rank[organs[r.tissue]]) {
      organs[r.tissue] = r.level;
    }
  }

  return organs;
}

export async function getDrugClinicalOrgans(drugName) {
  const uniprots = await getClinicalUniprotsForDrug(drugName);
  if (!uniprots.length) throw new Error("No clinical targets found");

  const ensembls = await mapUniProtToEnsembl(uniprots);
  const organs = await getOrgansFromMongoBatch(ensembls);

  return { drug: drugName, uniprots, ensembls, organs };
}

export async function updateDrugOrgansCache(drugName) {
  const data = await getDrugClinicalOrgans(drugName);

  const filteredOrgans = Object.fromEntries(
    Object.entries(data.organs).filter(([_, level]) => level === "Medium" || level === "High")
  );

  await drugDB.collection("drug_organs_cache").updateOne(
    { drug: drugName },
    { $set: { organs: filteredOrgans, updated_at: new Date() } },
    { upsert: true }
  );

  return filteredOrgans;
}
