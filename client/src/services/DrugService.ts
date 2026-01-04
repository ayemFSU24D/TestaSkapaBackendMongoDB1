import { auth } from "../firebase";

// services/drugService.js
export const getDrugData = async (drugName: string) => {
  if (!drugName) return null;

  try {
    // Hämta Firebase-token
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("User is not logged in");

    const res = await fetch(`http://localhost:3000/auth-api/drug/${drugName}/organs-auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // <-- här skickas token
      }
    });

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

