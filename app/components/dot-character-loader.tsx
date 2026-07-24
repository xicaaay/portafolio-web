"use client";

import { motion, useReducedMotion } from "motion/react";
import { InteractiveCharacter } from "./interactive-character";

type DotCharacterLoaderProps = {
  ready?: boolean;
  label?: string;
  overlay?: boolean;
};

export function DotCharacterLoader({
  ready = false,
  label = "Preparando contenido",
  overlay = false,
}: DotCharacterLoaderProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const statusTitle = ready ? "LISTO" : "CARGANDO";

  return (
    <div
      className={`dot-loader${overlay ? " dot-loader-overlay" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={ready ? "Contenido listo" : label}
    >
      <motion.div
        className={`dot-loader-character${ready ? " is-ready" : ""}`}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.08 : 0.52, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <InteractiveCharacter
          variant="loader"
          ariaLabel="Personaje de carga"
          disabled
        />
      </motion.div>

      <div className="dot-loader-copy">
        <motion.strong
          key={statusTitle}
          initial={
            ready || shouldReduceMotion
              ? false
              : { clipPath: "inset(-0.12em 100% -0.12em -0.08em)" }
          }
          animate={{ clipPath: "inset(-0.12em -0.08em -0.12em -0.08em)" }}
          transition={{ duration: shouldReduceMotion ? 0.08 : 0.28, ease: "linear" }}
        >
          {statusTitle}
        </motion.strong>
        <span>{ready ? "Contenido preparado" : label}</span>
      </div>
    </div>
  );
}
