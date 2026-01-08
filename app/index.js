import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/DB.js";
import drugRoutes from "./routes/drugRoutes.js";
import { authenticate } from "./middleware/authenticate.js";
import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync(process.env.SERVICE_ACCOUNT_FILE, "utf8")
);
 

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();


app.use(cors());
app.use(express.json());

connectDB();


app.get("/", (_req, res) => {
  res.send("Backend running");
});

app.use("/api/drug/", drugRoutes);   // druglist
app.use("/auth-api/drug", drugRoutes);
app.use("/free-api/drug", drugRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
