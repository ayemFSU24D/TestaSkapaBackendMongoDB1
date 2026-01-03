// services/drugService.js
export const getDrugData = async (drugName:string) => {
  if (!drugName) return null;

  try {
    const res = await fetch(`http://localhost:3000/api/drug/${drugName}/organs`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching drug data:", err);
    return null; // Returnera null vid fel
  }
};
