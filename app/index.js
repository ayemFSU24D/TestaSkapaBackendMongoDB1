import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

/* ------------------ APP SETUP ------------------ */

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGO_URL);
let tissueDB;
let drugDB;

/* ------------------ DB CONNECT ------------------ */

async function connectDB() {
  try {
    await client.connect();
      tissueDB = client.db("BlaBla");
    drugDB = client.db("DrugCentral");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectDB();

/* ------------------ HELPERS ------------------ */

/**
 * 1️⃣ Hämta UniProt-accessions från MongoDB
 * Endast kliniska targets: moa = 1, tdl = "Tclin"
 */
async function getClinicalUniprotsForDrug(drugName) {
  console.log("Searching for drug:", drugName);
  const drug = await drugDB.collection("clinicaltargets").findOne({
    generic_name: drugName
  });

  console.log("Drug document found:", drug);

    if (!Array.isArray(drug.targets)) {
    console.log("❌ targets is NOT an array");
    return [];
  }

  const uniprots = new Set();

  for (const t of drug.targets) {
    if (t.organism !== "Homo sapiens") continue;

    // tdl kan vara: "Tclin|Tbio|Tchem|NA"
    const tdlValues = typeof t.tdl === "string"
      ? t.tdl.split("|")
      : [];

    if (!tdlValues.includes("Tclin")) continue;

    // accession kan vara: "P12345|Q99999|O14764"
    if (typeof t.accession === "string") {
      t.accession
        .split("|")
        .map(a => a.trim())
        .filter(Boolean)
        .forEach(a => uniprots.add(a));
    }
  }

  console.log("Clinical UniProt accessions:", [...uniprots]);
  return [...uniprots];
}



/**
 * 2️⃣ UniProt → Ensembl (batch + concurrency)
 */
async function mapUniProtToEnsembl(uniprots) {
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
      const statusRes = await fetch(
        `https://rest.uniprot.org/idmapping/status/${jobId}`
      );
      const statusJson = await statusRes.json();
      status = statusJson.jobStatus || "FINISHED";
    }

    const resultRes = await fetch(
      `https://rest.uniprot.org/idmapping/results/${jobId}`
    );
    const resultJson = await resultRes.json();

    resultJson.results?.forEach(r => {
      if (r.to?.startsWith("ENSG")) {
        ensembls.add(r.to.split(".")[0]);
      }
    });
  };

  const queue = [...batches];
  const workers = new Array(concurrency).fill(null).map(async () => {
    while (queue.length) {
      await mapBatch(queue.shift());
    }
  });

  await Promise.all(workers);
  return [...ensembls];
}

/**
 * 3️⃣ Ensembl → Organ (HPA)
 * Returnerar högsta expressionsnivå per organ
 */
async function getOrgansFromMongoBatch(ensembls) {
  if (!ensembls.length) return {};

  const rows = await tissueDB
    .collection("hpa_normal_tissue")
    .find({ ensembl: { $in: ensembls } })
    .toArray();

  const rank = {
    "Not detected": 0,
    "Low": 1,
    "Medium": 2,
    "High": 3
  };

  const organs = {};

  for (const r of rows) {
    if (!organs[r.tissue] || rank[r.level] > rank[organs[r.tissue]]) {
      organs[r.tissue] = r.level;
    }
  }

  return organs;
}

/**
 * 4️⃣ Hela pipeline-funktionen
 */
async function getDrugClinicalOrgans(drugName) {
  const uniprots = await getClinicalUniprotsForDrug(drugName);
  if (!uniprots.length) {
    throw new Error("No clinical targets found");
  }

  const ensembls = await mapUniProtToEnsembl(uniprots);
  const organs = await getOrgansFromMongoBatch(ensembls);

  return {
    drug: drugName,
    uniprots,
    ensembls,
    organs
  };
}

async function updateDrugOrgansCache(drugName) {
  // 1️⃣ Hämta kliniska UniProt-targets + pipeline
  const data = await getDrugClinicalOrgans(drugName);

  // 2️⃣ Filtrera endast Medium och High organs
  const filteredOrgans = Object.fromEntries(
    Object.entries(data.organs).filter(([_, level]) =>
      level === "Medium" || level === "High"
    )
  );

  // 3️⃣ Spara i cache
  await drugDB.collection("drug_organs_cache").updateOne(
    { drug: drugName },
    { $set: { organs: filteredOrgans, updated_at: new Date() } },
    { upsert: true }
  );

  // 4️⃣ Returnera organs
  return filteredOrgans;
}




/* ------------------ API ROUTES ------------------ */

app.get("/", (_req, res) => {
  res.send("Backend running");
});

/**
 * 🎯 FRONTEND-ENDPOINT
 * GET /api/drug/:name/clinical-organs
 */
app.get("/api/drug/:name/organs", async (req, res) => {
  const drugName = req.params.name;

  try {
    // 1️⃣ Kolla cache först
    let cached = await drugDB.collection("drug_organs_cache").findOne({ drug: drugName });

    if (!cached) {
      // 2️⃣ Om ej cache → uppdatera cache
      const organs = await updateDrugOrgansCache(drugName);
      return res.json({ drug: drugName, organs });
    }

    // 3️⃣ Returnera cached organs
    res.json({ drug: drugName, organs: cached.organs });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/* ------------------ START SERVER ------------------ */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
