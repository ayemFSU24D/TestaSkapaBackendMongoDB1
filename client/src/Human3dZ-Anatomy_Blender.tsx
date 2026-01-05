import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { Mesh } from "three";
import { ThreeEvent } from "@react-three/fiber";
import { Primitive } from "./r3f-wrappers";
import { HPAtoZAnatomyMap } from "./HPAtoZAnatomyMap";

type ModelProps = {
  highlightedOrgans?: string[];
  onSelectOrgan?: (organName: string) => void;
};

/**
 * Normaliserar Z-Anatomy mesh-namn
 * Ex:
 *  "Bronchus.l" → "bronchus"
 *  "Cerebral cortex_xxxxx" → "cerebralcortex"
 */




function normalizeZAnatomyName(name: string) {
  return name
    .toLowerCase()
    .split(/\s|\.|_/)[0] // ta första ordet innan mellanslag, punkt eller underscore
    .replace(/\d+$/, "") // ta bort siffror i slutet
    .trim();
}



/**
 * Normaliserar HPA-namn
 * Ex:
 *  "stomach 2" → "stomach"
*/
function normalizeHPAName(name: string) {
  return name
  .toLowerCase()
  .replace(/\s*\d+$/, "") // ta bort " 1", " 2"
  .trim();
}

export function Model({
  highlightedOrgans = []
}: ModelProps) {
  const { scene } = useGLTF("/models/Z-Anatomy+arm_muskles+armskinmesh4.glb");
  
  // Skapa set av normaliserade HPA-namn
  const highlightedSet = useMemo(
    () => new Set(highlightedOrgans.map(normalizeHPAName)),
    [highlightedOrgans]
  );

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof Mesh)) return;
      
      obj.material = obj.material.clone();
      obj.material.transparent = true;
      
      const meshBase = normalizeZAnatomyName(obj.name);
     /*  console.log("Original Z-Anatomy name:", obj.name); */
      //console.log("Normalized Z-Anatomy name:", meshBase);

      if (!obj.userData.originalColor) {
        obj.userData.originalColor = obj.material.color.clone();
      }

      // default: blek
      /* obj.material.color.set("#cccccc"); */
      obj.material.opacity = 0.03;
      obj.material.depthWrite = false;

      // Highlight om match via HPAtoZAnatomyMap
      const isHighlighted = [...highlightedSet].some((hpaName) => {
        const mapped = HPAtoZAnatomyMap[hpaName]; // string eller string[]
        if (!mapped) return false;

        if (Array.isArray(mapped)) {
          return mapped.some((m) => normalizeZAnatomyName(m) === meshBase);
        } else {
          return normalizeZAnatomyName(mapped) === meshBase;
        }
      });

      if (isHighlighted) {
        obj.material.color.copy(obj.userData.originalColor);
        obj.material.opacity = 1;
        obj.material.depthWrite = true;
      }
    });
  }, [scene, highlightedSet]);

  return (
    <Primitive
      object={scene}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
      }}
    />
  );
}
