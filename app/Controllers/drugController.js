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


export const getDrugList = async (req, res) => {
  console.log("getDrugList körs");
  try {
    const drugs = await drugDB
      .collection("clinicaltargets") // ← anpassa till din collections namn
      .find({}, { projection: { _id: 0, generic_name: 1 } })
      .toArray();

    // Gör om till enkel lista
    const drugNames = drugs
      .map(d => d.generic_name)
      .filter(Boolean)
      .sort();

    res.json(drugNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

