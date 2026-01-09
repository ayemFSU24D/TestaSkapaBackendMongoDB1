import { Group } from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Model } from "../Human3dZ-Anatomy_Blender";
import { useResponsiveModelScale } from "../hooks/useResponsiveModelScale";
import { Primitive } from "../r3f-wrappers";

type Props = {
  highlightedOrgans: string[];
};

export function ResponsiveModel({ highlightedOrgans }: Props) {
  const groupRef = useRef<Group>(new Group());
  const targetScale = useResponsiveModelScale();

  useFrame(() => {
    groupRef.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale },
      0.1
    );
  });
  groupRef.current.position.y = -2.2;

  return (
    <Primitive object={groupRef.current}>
      <Model highlightedOrgans={highlightedOrgans} />
    </Primitive>
  );
}

