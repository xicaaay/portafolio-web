"use client";

import type { ReactNode } from "react";
import { motion, MotionConfig } from "motion/react";

/* Curva suave y sin rebote, compartida por toda la secuencia de entrada. */
const SOFT_EASE = [0.22, 1, 0.36, 1] as const;

type RevealKind = "rise" | "sticker" | "sign";

type RevealProps = {
  /* Etiqueta HTML del contenedor animado. */
  as?: "div" | "li";
  children: ReactNode;
  className?: string;
  /* Segundos de espera antes de iniciar la entrada. */
  delay?: number;
  /* rise: aparece subiendo. sticker: escala y rotación. sign: cartel de navegación. */
  kind?: RevealKind;
  /* Rotación final en grados; solo se usa con kind="sticker". */
  rotate?: number;
  /* Variable CSS opcional para el cartel (inclinación y desplazamiento). */
  style?: React.CSSProperties;
};

/*
 * Con reducedMotion="user" Motion desactiva las transformaciones cuando la persona
 * prefiere menos movimiento y deja solo el cambio de opacidad.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/*
 * Envoltorio de entrada. Anima solo opacity y transform, así que no provoca cambios
 * de layout. El hover se resuelve aparte con CSS en el elemento interior para que
 * ambas transformaciones nunca compitan.
 */
export function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  kind = "rise",
  rotate = 0,
  style,
}: RevealProps) {
  const Tag = motion[as] as typeof motion.div;

  const initial =
    kind === "sticker"
      ? { opacity: 0, scale: 0.82, rotate: rotate - 10 }
      : kind === "sign"
        ? { opacity: 0, y: 28, scale: 0.97 }
        : { opacity: 0, y: as === "li" ? 10 : 20 };

  const animate =
    kind === "sticker"
      ? { opacity: 1, scale: 1, rotate }
      : kind === "sign"
        ? { opacity: 1, y: 0, scale: 1 }
        : { opacity: 1, y: 0 };

  return (
    <Tag
      animate={animate}
      className={className}
      initial={initial}
      style={style}
      transition={{ duration: kind === "sticker" ? 0.6 : 0.7, delay, ease: SOFT_EASE }}
    >
      {children}
    </Tag>
  );
}
