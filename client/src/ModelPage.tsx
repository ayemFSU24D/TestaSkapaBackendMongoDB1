/* import Home from './pages/Home.jsx'

function ModelPage() {
  return(

    <div>
    <h1>ModelPage Component</h1>
    <Home />
    
  </div>
  )
}

export default ModelPage;
 */

/* import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Model() {
  const mountRef = useRef(null);

  useEffect(() => {
    // 1. Skapa scen, kamera och renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lägg till ljus
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    // 3. Ladda GLB-modellen
    const loader = new GLTFLoader();
    const modelUrl = '/models/Z_Anatomy_After_Blender.glb';

    loader.load(
      modelUrl,
      (gltf) => {
        scene.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // 4. Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 5. Rensa när komponenten avmonteras
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default ModelPage; */


//---------------------Fungerar!!!!!!!!!!!!!!!  Visar 3d kroppen------------------------
//---------------------Fungerar!!!!!!!!!!!!!!!------------------------
//---------------------Fungerar!!!!!!!!!!!!!!!------------------------

/* import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/Z-Anatomy_After_Blender.glb");

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        console.log(obj.name);
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}


export default function ModelPage() {
  return (
    <><div style={{ width: '100vw', height: '100vh' }}>

      <h1>Test Model</h1>
      <Canvas camera={{ position: [3, 2, 3] }}>
        <ambientLight />
        <directionalLight position={[5, 5, 5]} />
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
    </>
  );
}
 */



//---------------------Fungerar!!!!!!!!!!!!!!!  Visar 3d kroppen och även specifika organer ------------------------
//---------------------Fungerar!!!!!!!!!!!!!!!------------------------
//---------------------Fungerar!!!!!!!!!!!!!!!------------------------

/* import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/Z-Anatomy_After_Blender.glb");
  
  useEffect(() => {
    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      
      // KLONA MATERIAL (annars påverkas allt)
      obj.material = obj.material.clone();
      obj.material.transparent = true;
      
      const name = obj.name.toLowerCase();

      const isLiver = name.includes("liver");
      
      if (isLiver) {
        // Levern tydlig
        obj.material.opacity = 1;
        obj.material.depthWrite = true;
      } else {
        // Resten av kroppen genomskinlig
        obj.material.opacity = 0.15;
        obj.material.depthWrite = false;
      }
    });
  }, [scene]);
  
  return <primitive object={scene} />;
}

export default function ModelPage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [3, 2, 3] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
  );
} */




//---------------------Ska testa först--------------------
//---------------------Fungerar!!!!!!!!!!!!!!!----Kopplat till Backend api för proteininfohämtning--------------------
//---------------------Fungerar!!!!!!!!!!!!!!!  Visar 3d kroppen och även specifika organer ------------------------
//---------------------Fungerar!!!!!!!!!!!!!!!------------------------


import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Model } from "./Human3dZ-Anatomy_Blender";
import { ProteinPopup } from "./ProteinPopup";
import { useRef } from 'react'
import { Mesh } from 'three'
import { AmbientLight, DirectionalLight } from './r3f-wrappers'



export default function ModelPage() {
  const meshRef = useRef<Mesh>(null!)
  const [drugInput, setDrugInput] = useState(""); // vad användaren skriver
  const [drug, setDrug] = useState("");               // läkemedel som visas
  type DrugData = { drug: string; organs: Record<string, number> }
  const [drugData, setDrugData] = useState<DrugData | null>(null);
  const [highlightedOrgans, setHighlightedOrgans] = useState<string[]>([]);
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);


  // Hämtar data när man klickar på knappen
  const fetchDrugData = async () => {
    if (!drugInput) return;
    try {
      const res = await fetch(`http://localhost:3000/api/drug/${drugInput}/organs`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setDrug(drugInput);
      setDrugData(data);
      setHighlightedOrgans(Object.keys(data.organs || {}));
      setSelectedOrgan(null); // stäng popup om öppen
    } catch (err) {
      console.error("Error fetching drug data:", err);
      setDrugData(null);
      setHighlightedOrgans([]);
    }
  };

  return (
    <>
      {/* Input och knapp */}
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
        <input
          type="text"
          value={drugInput}
          onChange={(e) => setDrugInput(e.target.value.toLowerCase())}
          placeholder="Enter drug (e.g. aspirin)"
        />
        <button onClick={fetchDrugData} style={{ marginLeft: 5 }}>
          Visa i 3D
        </button>
      </div>

      <Canvas camera={{ position: [3, 2, 3], fov: 50 }} style={{ width: "100vw", height: "100vh" }}>
        <AmbientLight intensity={0.6} />
        <DirectionalLight position={[5, 5, 5]} />

        <Model
          onSelectOrgan={(name: string) => setSelectedOrgan(name)}
          highlightedOrgans={highlightedOrgans}
          organLevels={drugData?.organs}
        />

        <OrbitControls maxDistance={10} minDistance={2} target={[0, 1, 0]} />
      </Canvas>

      {/* Popup med läkemedelsinfo */}
      {selectedOrgan && drugData && (
        <ProteinPopup
          organ={selectedOrgan}
          level={drugData.organs[selectedOrgan]}
          drug={drugData.drug}
          onClose={() => setSelectedOrgan(null)}
        />
      )}
    </>
  );
}