import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "/config/DB.js";
import drugRoutes from "./routes/drugRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (_req, res) => res.send("Backend running"));
app.use("/api/drug", drugRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));