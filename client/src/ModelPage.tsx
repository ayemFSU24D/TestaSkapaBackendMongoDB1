import { getDrugData, getDrugList } from './services/DrugService';
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Model } from "./Human3dZ-Anatomy_Blender";
import { ProteinPopup } from "./ProteinPopup";
import { Mesh } from 'three';
import { AmbientLight, DirectionalLight } from './r3f-wrappers'
import { auth } from "./firebase"; // justera path vid behov
import { onAuthStateChanged, User } from "firebase/auth";
import { ResponsiveModel } from './components/ResponsiveModel';
import { NavLink } from 'react-router-dom';

export default function ModelPage() {
  const [user, setUser] = useState<User | null>(null);

  const meshRef = useRef<Mesh>(null!)
  const [drugInput, setDrugInput] = useState(""); // vad användaren skriver
  const [drug, setDrug] = useState("");           // läkemedel som visas
  type DrugData = { drug: string; organs: Record<string, string> }
  const [drugData, setDrugData] = useState<DrugData | null>(null);
  const [highlightedOrgans, setHighlightedOrgans] = useState<string[]>([]);

const [drugList, setDrugList] = useState<string[]>([]);


  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return unsubscribe;
}, []);


  // Hämta drugList med caching
  useEffect(() => {
    const cached = localStorage.getItem("drugList");
    if (cached) {
      try {
        setDrugList(JSON.parse(cached));
        return; // vi behöver inte hämta från backend
      } catch (err) {
        console.error("Failed to parse cached drugList:", err);
      }
    }

    // Annars hämta från backend och spara i localStorage
    getDrugList().then((list) => {
      setDrugList(list);
      localStorage.setItem("drugList", JSON.stringify(list));
    });
  }, []);

  


  // Hämtar data när man klickar på knappen

const fetchDrugData = async () => {
  if (!drugInput) return;

  const data = await getDrugData(drugInput);

  if (data) {
    console.log("Fetched drug data:", data);
    setDrug(drugInput);
    setDrugData(data);
    setHighlightedOrgans(Object.keys(data.organs || {}));
  } else {
    setDrugData(null);
    setHighlightedOrgans([]);
  }
};


 if (!user) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <h2 className="text-xl font-semibold">
        You need to be logged in to use the 3D model
      </h2>

      <NavLink
        to="/Signup"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Log in
      </NavLink>
    </div>
  );
}


return (
  <>
   <div className="flex flex-col lg:flex-row gap-6 w-full">

      {/* VÄNSTER: Input + ProteinPopup */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">

        <div className="bg-white p-4 rounded shadow">
          <input
            className="w-full border p-2 rounded mb-2"
            list="drug-list"
            type="text"
            value={drugInput}
            onChange={(e) => setDrugInput(e.target.value.toLowerCase())}
            placeholder="Enter drug"
          />

          <button
            onClick={fetchDrugData}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Show in 3D
          </button>

          {/* ProteinPopup DIREKT UNDER INPUT */}
          {drugData && (
            <div className="mt-4 max-h-[40vh] overflow-y-auto">
              <ProteinPopup
                drug={drugData.drug}
                organs={drugData.organs}
              />
            </div>
          )}
        </div>
      </div>

      {/* HÖGER: 3D-modell */}
      <div className="relative w-full lg:w-2/3 h-[50vh] lg:h-[70vh]">
        <Canvas
          camera={{ position: [4.5, 2.5, 4.5], fov: 50 }}
          className="w-full h-full"
        >
          <AmbientLight intensity={0.6} />
          <DirectionalLight position={[5, 5, 5]} />

          <ResponsiveModel
            highlightedOrgans={
              drugData ? Object.keys(drugData.organs) : []
            }
          />

          <OrbitControls
            maxDistance={10}
            minDistance={2}
            target={[0, 1, 0]}
          />
        </Canvas>
      </div>

    </div>

  </>
);

}