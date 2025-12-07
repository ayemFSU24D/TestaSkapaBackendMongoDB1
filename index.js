import { MongoClient } from "mongodb";
import express from "express";                       //kopplar backenden(servern) till non port
console.log(MongoClient);

const app = express();
app.use(express.json())


//let client= new MongoClient(process.env.MONGO_URL); //Azure injiceras: mongodb://mongo-service:27017 //mongo-service = name of MongoDB-containerappen in Azure, Intern DNS → backend hittar MongoDB automatiskt

//let client= new MongoClient("...URL från Attlas för driver...");// för koppling till Mongo Atlass-cloud
// let client = new MongoClient("mongodb://admin:pass123@localhost:27017");// till localhost som i sin tur kan vidarebefodra till DBen i Docker
 let client = new MongoClient("mongodb://localhost:27017");//--utan password

console.log(client);
let db;

let connect= async function () {
    await client.connect(); //kopplar klienten
    console.log("Connected") // skriver ut Connected i terminalen när koden körs

  db = client.db("BlaBla");
  const notes = await db.collection("EttKollektion").find({}).toArray();
console.log(notes);

}

connect();

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

// GET: Hämta alla dokument
app.get("/notes", async (req, res) => {
    try {
        const notes = await db
            .collection("EttKollektion")
            .find({})
            .toArray(); // Hämta alla dokument som array

        res.status(200).json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching notes");
    }
});






const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));