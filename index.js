import { MongoClient } from "mongodb";
import express from "express";                       //kopplar backenden(servern) till non port
console.log(MongoClient);

const app = express();
app.use(express.json())


let client= new MongoClient(process.env.MONGO_URL); //Azure injiceras: mongodb://mongo-service:27017 //mongo-service = name of MongoDB-containerappen in Azure, Intern DNS → backend hittar MongoDB automatiskt

//let client= new MongoClient("...URL från Attlas för driver...");// för koppling till Mongo Atlass-cloud
// let client = new MongoClient("mongodb://admin:pass123@localhost:27017");// till localhost som i sin tur kan vidarebefodra till DBen i Docker
// let client = new MongoClient("mongodb://localhost:27017");//--utan password

console.log(client);


let connect= async function () {
    await client.connect(); //kopplar klienten
    console.log("Connected") // skriver ut Connected i terminalen när koden körs













}

connect();


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}`));