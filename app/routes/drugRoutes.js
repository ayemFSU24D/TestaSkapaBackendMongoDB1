import express from "express";
import { getDrugOrgans } from "../Controllers/drugController.js";

const router = express.Router();

router.get("/:name/organs", getDrugOrgans);

export default router;
