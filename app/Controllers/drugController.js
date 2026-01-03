import { updateDrugOrgansCache } from "../services/drugService.js";
import { drugDB } from "../config/DB.js";

export const getDrugOrgans = async (req, res) => {
  const drugName = req.params.name;

  try {
    const cached = await drugDB
      .collection("drug_organs_cache")
      .findOne({ drug: drugName });

    if (!cached) {
      const organs = await updateDrugOrgansCache(drugName);
      return res.json({ drug: drugName, organs });
    }

    res.json({ drug: drugName, organs: cached.organs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

