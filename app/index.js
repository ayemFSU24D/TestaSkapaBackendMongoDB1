import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import zlib from "zlib";
import fetch from "node-fetch";
import fs from "fs";
import csv from "csv-parser"; 
import { pipeline } from "stream/promises";





console.log(MongoClient);

const app = express();
app.use(express.json());
app.use(cors());

//let client= new MongoClient(process.env.MONGO_URL); //Azure injiceras: mongodb://mongo-service:27017 //mongo-service = name of MongoDB-containerappen in Azure, Intern DNS → backend hittar MongoDB automatiskt

//let client= new MongoClient("...URL från Attlas för driver...");// för koppling till Mongo Atlass-cloud
// let client = new MongoClient("mongodb://admin:pass123@localhost:27017");// till localhost som i sin tur kan vidarebefodra till DBen i Docker
 let client = new MongoClient("mongodb://localhost:27017");//--utan password

console.log(client);
let db;

let connect= async function () {
   try {
    await client.connect(); //kopplar klienten
    console.log("Connected") // skriver ut Connected i terminalen när koden körs

    db = client.db("BlaBla");
    /* 
  const notes = await db.collection("EttKollektion").find({}).toArray();
console.log(notes);
 */

    const col = db.collection("hpa_normal_tissue");



//---------------- Import HPA normal tissue data into MongoDB -----
  /* const batchSize = 1000;
let batch = [];

await pipeline(
  fs.createReadStream("normal_tissue.tsv"),
  csv({ separator: "\t" }),
  async function* (source) {
    for await (const row of source) {
      const doc = {
        ensembl: row.Gene,
        gene: row["Gene name"],
        organ: row.Tissue,
        tissue: row.Tissue,
        cell_type: row["Cell type"] || null,
        level: row.Level,
        reliability: row.Reliability
      };
      batch.push(doc);

      if (batch.length >= batchSize) {
        await col.insertMany(batch);
        batch = [];
      }
    }

    // Insert remaining rows
    if (batch.length > 0) {
      await col.insertMany(batch);
    }
  }
);

await col.createIndex({ ensembl: 1 });
await col.createIndex({ organ: 1 });

console.log("HPA import done!");
      // stäng klienten om du inte behöver fortsätta använda db
      // await client.close();
      */
    } catch (err) {
      console.error("Error during MongoDB operations:", err);
    }
  }; 

 connect();



async function getOrgansFromMongoBatch(ensembls) {
  const cleanedEnsembls = ensembls.map(id => id.split(".")[0]);
const rows = await db.collection("hpa_normal_tissue")
  .find({ ensembl: { $in: cleanedEnsembls } })
  .toArray();


  const rank = { "Not detected": 0, "Low": 1, "Medium": 2, "High": 3 };
  const organLevels = {};

  for (const r of rows) {
    if (!organLevels[r.tissue] || rank[r.level] > rank[organLevels[r.tissue]]) {
      organLevels[r.tissue] = r.level;
    }
  }
console.log("Organ levels from getOrgansFromMongoBatch:", organLevels);
  return organLevels;
}


// Merge organ-objekt från flera proteiner
function mergeOrgans(existing, addition) {
  const rank = { "Not detected": 0, "Low": 1, "Medium": 2, "High": 3 };
  for (const [organ, level] of Object.entries(addition)) {
    if (!existing[organ] || rank[level] > rank[existing[organ]]) {
      existing[organ] = level;
    }
  }
  return existing;
}

// --- Example placeholders för ChEMBL integration ---
async function getChEMBLId(drugName) {
  const url = `https://www.ebi.ac.uk/chembl/api/data/molecule/search.json?q=${encodeURIComponent(drugName)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.molecules?.length) throw new Error("Drug not found in ChEMBL");
  return data.molecules[0].molecule_chembl_id;
}

async function getDrugTargets(chemblId) {
  // Hämta targets istället för activities
  const url = `https://www.ebi.ac.uk/chembl/api/data/target.json?molecule_chembl_id=${chemblId}&limit=1000`;
  const res = await fetch(url);
  const data = await res.json();

  const uniprots = new Set();

  data.targets?.forEach(target => {
    // Filtrera bort icke-mänskliga och multi-protein targets
    if (target.organism !== "Homo sapiens") return;
    if (target.target_type !== "SINGLE PROTEIN") return;

    // Lägg till UniProt-accessioner
    target.target_components?.forEach(comp => {
      if (comp.accession) uniprots.add(comp.accession);
    });
  });

  /* console.log("UniProt targets (filtered):", [...uniprots]); */
  return [...uniprots];
}





// Placeholder: mappa UniProt → Ensembl (kan vara statisk JSON)
async function mapUniProtToEnsembl(uniprots) {
  if (!uniprots.length) return [];
  console.log("Mapping UniProtaaaaaaaaaaaaaaaaaaaa to Ensembl:", uniprots.length, "accessioffffffffffffffffffns");

  const batchSize = 100; // antal per batch
  const concurrency = 3; // max antal parallella batchar
  const ensembls = new Set();

  // dela upp i batchar
  const batches = [];
  for (let i = 0; i < uniprots.length; i += batchSize) {
    batches.push(uniprots.slice(i, i + batchSize));
  }

  // hjälpfunktion för en batch
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
    if (!jobId) throw new Error("UniProt mapping job failed for batch");

    // vänta på färdigt jobb
    let status = "RUNNING";
    while (status === "RUNNING") {
      await new Promise(r => setTimeout(r, 1000));
      const statusRes = await fetch(`https://rest.uniprot.org/idmapping/status/${jobId}`);
      const statusJson = await statusRes.json();
      status = statusJson.jobStatus || "FINISHED";
    }

    if (status !== "FINISHED") throw new Error("UniProt mapping did not finish");

    // hämta resultat
    const resultRes = await fetch(`https://rest.uniprot.org/idmapping/results/${jobId}`);
    const resultJson = await resultRes.json();

    resultJson.results?.forEach(r => {
      if (r.to?.startsWith("ENSG")) ensembls.add(r.to);
    });
  };

  // parallell exekvering med begränsad concurrency
  const queue = [...batches];
  const workers = new Array(concurrency).fill(null).map(async () => {
    while (queue.length > 0) {
      const batch = queue.shift();
      try {
        await mapBatch(batch);
      } catch (err) {
        console.error("Error mapping batch:", err);
      }
    }
  });

  await Promise.all(workers);

  /* console.log("Finished mapping all batches. Total ENSG:", ensembls.size);
  console.log("Finished mapping ensembls", ensembls); */
  return [...ensembls];
}




async function updateDrugOrgansCache(drugName) {
  // 1. Hämta ChEMBL ID
  const chemblId = await getChEMBLId(drugName);

  // 2. Hämta UniProt-targets från ChEMBL
  const uniprots = await getDrugTargets(chemblId);

  // 3. Mappa UniProt → ENSG
  const ensembls = await mapUniProtToEnsembl(uniprots);

  // 4. Hämta organ-data från HPA i batch
  const organs = await getOrgansFromMongoBatch(ensembls);
  console.log("Organs fetched for drug", drugName);
  console.log("Organs :", organs);
  console.log("ensembls:", ensembls);

  // 5. Spara i cache-kollektion
  await db.collection("drug_organs_cache").updateOne(
    { drug: drugName },
    { $set: { chembl_id: chemblId, ensembls, organs, updated_at: new Date() } },
    { upsert: true }
  );

  return organs;
}



// --- Routes ---

app.get("/", (_req, res) => {
  res.send("Hello + Express!");
});

app.post("/add", async (req, res) => {
    try {
        const data = req.body;   // det du skickar från frontend/Postman

        const result = await db
            .collection("EttKollektion")  // <-- Din collection
            .insertOne(data);

        res.status(201).send({ insertedId: result.insertedId });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error inserting data");
    }
});

async function getOrgansFromMongo(ensembl)   //-----------bra för intern användning för debugging och testning-
 { const rows = await db.collection("hpa_normal_tissue") .find({ ensembl }) .toArray(); 
 const rank = { "Not detected": 0, "Low": 1, "Medium": 2, "High": 3 }; const organLevels = {}; 
 for (const r of rows) { if (!organLevels[r.tissue] || rank[r.level] > rank[organLevels[r.tissue]])
   { organLevels[r.tissue] = r.level; } } return organLevels; }

app.get("/api/protein/:ensembl/organs", async (req, res) => { //-----------bra för intern användning för debugging och testning-
  const { ensembl } = req.params;
  const organLevels = await getOrgansFromMongo(ensembl);
  res.json({ Tissue: organLevels });
});

app.get("/api/drug/:name/organs", async (req, res) => {
  const drugName = req.params.name;

  // 1. Försök hämta från cache först
  let cached = await db.collection("drug_organs_cache").findOne({ drug: drugName });

  if (!cached) {
    // 2. Om ej finns → fyll cache
    try {
      const organs = await updateDrugOrgansCache(drugName);
      return res.json({ drug: drugName, organs });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 3. Returnera cache-resultat
  res.json({ drug: drugName, organs: cached.organs });
});






const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));