import type { CSSProperties } from "react";

// Delay index for the `enter` / `enter-scale` utilities (each step adds 90ms).
export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;
