import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Mesh } from "three";
import { ThreeEvent } from "@react-three/fiber";
import { HPAtoZAnatomyMap } from "./HPAtoZAnatomyMap";
import { Primitive } from './r3f-wrappers'

type ModelProps = {
  highlightedOrgans?: string[];
  onSelectOrgan?: (organName: string) => void;
  organLevels?: Record<string, number>;
};

export function Model({ highlightedOrgans = [], onSelectOrgan }: ModelProps) {
  const meshRef = useRef<Mesh>(null!); // non-null assertion för TS
  const { scene } = useGLTF("/models/Z-Anatomy_After_Blender.glb");

  const highlightedSet = useMemo(
    () => new Set(highlightedOrgans.map((o) => o.toLowerCase())),
    [highlightedOrgans]
  );

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof Mesh)) return;

      obj.material = obj.material.clone();
      obj.material.transparent = true;

      const name = obj.name.toLowerCase();
      const isSkin = name.includes("skin");

      // Spara originalfärg
      if (!obj.userData.originalColor) {
        obj.userData.originalColor = obj.material.color.clone();
      }

      // HUD: alltid genomskinlig
      if (isSkin) {
        obj.material.opacity = 0.05;
        obj.material.depthWrite = false;
        return;
      }

      // Default färg för organ
      obj.material.color.set("#cccccc");
      obj.material.opacity = 0.15;
      obj.material.depthWrite = false;

      // Matcha organ
      const matchedOrgan = [...highlightedSet].find((o) => {
        const mapped = (HPAtoZAnatomyMap as Record<string, string>)[o];
        return (mapped && name.includes(mapped.toLowerCase())) || name.includes(o);
      });

      if (matchedOrgan) {
        obj.material.color.copy(obj.userData.originalColor);
        obj.material.opacity = 1;
        obj.material.depthWrite = true;
      }

      // Specifikt exempel: heart
      if (name.includes("heart")) {
        obj.material.color.set("red");
        obj.material.opacity = 1;
        obj.material.depthWrite = true;
      }
    });
  }, [scene, highlightedSet]);

  // Logga alla meshnamn
  useEffect(() => {
    const meshNames: string[] = [];
    scene.traverse((obj) => {
      if (obj instanceof Mesh) {
        meshNames.push(obj.name);
      }
    });
    console.log("Alla meshnamn i modellen:", meshNames);
  }, [scene]);

  // Use typed wrapper instead of a runtime alias or // @ts-ignore
  // Wrapper enforces prop types while delegating to 'primitive' at runtime.
  return (
    <Primitive
      object={scene}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelectOrgan?.(e.object.name);
      }}
    />
  );
}
