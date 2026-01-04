import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);


let drugDB;

export const connectDB = async () => {
  try {
    await client.connect();
    drugDB = client.db("DrugCentral");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export { drugDB };
