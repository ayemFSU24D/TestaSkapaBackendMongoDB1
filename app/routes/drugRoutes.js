import express from "express";
import { getDrugOrgans } from "../Controllers/drugController.js";
import { authenticate } from "../middleware/authenticate.js";
import { getDrugList } from "../Controllers/drugController.js";


const router = express.Router();

router.get("/list", getDrugList);
router.get("/:name/organs-auth", authenticate, getDrugOrgans);
router.get("/:name/organs-free", getDrugOrgans);
export default router;
