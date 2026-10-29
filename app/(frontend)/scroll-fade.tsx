"use client";

import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/* Fracción de la altura de la ventana que hay que recorrer para que el contenido desaparezca por completo. */
const FADE_DISTANCE = 0.5;

/* Desvanece su contenido mientras el primer pantallazo se va con el scroll. */
export function ScrollFade({ children, className }: { children: ReactNode; className?: string }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, (scroll) => {
    if (typeof window === "undefined") return 1;
    return 1 - Math.min(1, Math.max(0, scroll / (window.innerHeight * FADE_DISTANCE)));
  });

  return (
    <motion.div className={className} style={{ opacity }}>
      {children}
    </motion.div>
  );
}
