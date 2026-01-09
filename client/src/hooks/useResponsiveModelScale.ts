import { useThree } from "@react-three/fiber";
import { useMemo } from "react";

const BASE_SCALE = 4; // 👈 DIN desktop-storlek

export function useResponsiveModelScale() {
  const { size } = useThree();

  return useMemo(() => {
    if (size.width < 640) {
      return BASE_SCALE * 0.7;   // mobil
    }
    if (size.width < 1024) {
      return BASE_SCALE * 0.85;  // tablet
    }
    return BASE_SCALE;           // desktop (perfekt storlek)
  }, [size.width]);
}
