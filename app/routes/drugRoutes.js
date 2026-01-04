import express from "express";
import { getDrugOrgans } from "../Controllers/drugController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/:name/organs-auth", authenticate, getDrugOrgans);
router.get("/:name/organs-free", getDrugOrgans);
export default router;
