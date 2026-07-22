"use client";

import { motion, useReducedMotion } from "motion/react";

const LOADING_POSITIONS = [
  [-22, -20],
  [22, -20],
  [-22, 0],
  [0, 0],
  [22, 0],
  [-22, 20],
  [0, 20],
  [22, 20],
] as const;

const CHARACTER_POSITIONS = Array.from({ length: 8 }, (_, index) => {
  const angle = (index * Math.PI) / 4 - Math.PI / 2;
  return [Math.cos(angle) * 27, Math.sin(angle) * 27] as const;
});

const NAVIGATION_DUST = [
  { x: -23, y: -3 },
  { x: -16, y: -9 },
  { x: -9, y: -5 },
  { x: 9, y: -5 },
  { x: 16, y: -9 },
  { x: 23, y: -3 },
] as const;

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

  return (
    <div
      className={`dot-loader${overlay ? " dot-loader-overlay" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={ready ? "Contenido listo" : label}
    >
      <motion.div
        className="dot-loader-character"
        animate={
          ready && !shouldReduceMotion
            ? { y: [0, -20, 0, -16, 0, -12, 0] }
            : { y: 0 }
        }
        transition={
          ready && !shouldReduceMotion
            ? { duration: 1.16, delay: 0.72, ease: "easeInOut" }
            : { duration: 0.12 }
        }
        aria-hidden="true"
      >
        <svg className="dot-loader-figure" viewBox="0 0 72 72">
          <motion.circle
            className="dot-loader-head-line"
            cx="36"
            cy="36"
            r="29"
            fill="transparent"
            stroke="#f5f6f1"
            strokeWidth="1.65"
            strokeDasharray="182.3"
            initial={false}
            animate={{
              opacity: ready ? 1 : 0,
              strokeDashoffset: ready ? 0 : 182.3,
              rotate: ready ? 0 : -72,
            }}
            transition={{
              duration: shouldReduceMotion ? 0.08 : 0.46,
              delay: ready ? 0.24 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          <motion.circle
            className="dot-loader-head-complete"
            cx="36"
            cy="36"
            r="29"
            fill="transparent"
            stroke="#f5f6f1"
            strokeWidth="1.65"
            initial={false}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0.08 : 0.1, delay: ready ? 0.64 : 0 }}
          />
        </svg>

        {LOADING_POSITIONS.map((loadingPosition, index) => {
          const position = ready
            ? CHARACTER_POSITIONS[index]
            : loadingPosition;

          return (
            <motion.span
              className="dot-loader-point"
              key={index}
              animate={
                ready
                  ? {
                      x: position[0],
                      y: position[1],
                      opacity: [0.88, 0],
                      scale: [1, 0.45],
                    }
                  : {
                      x: position[0],
                      y: [position[1] - 2, position[1] + 2, position[1] - 2],
                      opacity: [0.22, 1, 0.22],
                      scale: [0.82, 1.18, 0.82],
                    }
              }
              transition={
                ready
                  ? {
                      duration: shouldReduceMotion ? 0.08 : 0.54,
                      delay: shouldReduceMotion ? 0 : index * 0.025,
                      ease: [0.22, 1, 0.36, 1],
                    }
                  : {
                      duration: shouldReduceMotion ? 0 : 1.05,
                      delay: index * 0.09,
                      repeat: shouldReduceMotion ? 0 : Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }
              }
            />
          );
        })}

        <motion.span
          className="dot-loader-eye dot-loader-eye-left"
          initial={false}
          animate={{ opacity: ready ? 1 : 0, scaleY: ready ? 1 : 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0.08 : 0.24, delay: ready ? 0.46 : 0 }}
        />
        <motion.span
          className="dot-loader-eye dot-loader-eye-right"
          initial={false}
          animate={{ opacity: ready ? 1 : 0, scaleY: ready ? 1 : 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0.08 : 0.24, delay: ready ? 0.5 : 0 }}
        />

        <span className="dot-loader-particles">
          {NAVIGATION_DUST.map((dust, index) => {
            return (
              <motion.i
                key={index}
                animate={
                  ready && !shouldReduceMotion
                    ? {
                        x: [0, 0, dust.x * 0.45, dust.x, dust.x * 1.3, 0, dust.x * 0.4, dust.x * 0.8, dust.x * 1.1, 0, dust.x * 0.35, dust.x * 0.65, dust.x * 0.85],
                        y: [0, 0, dust.y * 0.55, dust.y, dust.y * 1.25, 0, dust.y * 0.45, dust.y * 0.8, dust.y, 0, dust.y * 0.4, dust.y * 0.65, dust.y * 0.85],
                        opacity: [0, 0, 0.85, 0.65, 0, 0, 0.72, 0.5, 0, 0, 0.58, 0.4, 0],
                        scale: [0.35, 0.35, 1, 0.78, 0.3, 0.35, 0.88, 0.68, 0.3, 0.35, 0.72, 0.55, 0.28],
                      }
                    : { opacity: 0, x: 0, y: 0, scale: 0.4 }
                }
                transition={{
                  duration: 1.16,
                  delay: ready ? 0.72 + index * 0.008 : 0,
                  ease: "easeOut",
                  times: [0, 0.27, 0.32, 0.38, 0.45, 0.6, 0.65, 0.71, 0.78, 0.87, 0.92, 0.97, 1],
                }}
              />
            );
          })}
        </span>

        <motion.span
          className="dot-loader-shadow"
          initial={false}
          animate={{
            opacity: ready ? [0.2, 0.08, 0.2, 0.1, 0.2, 0.12, 0.2] : 0,
            scaleX: ready ? [1, 0.62, 1, 0.7, 1, 0.78, 1] : 0.7,
          }}
          transition={{ duration: shouldReduceMotion ? 0.08 : 1.16, delay: ready ? 0.72 : 0 }}
        />
      </motion.div>

      <div className="dot-loader-copy">
        <strong>{ready ? "LISTO" : "CARGANDO"}</strong>
        <span>{ready ? "Contenido preparado" : label}</span>
      </div>
    </div>
  );
}
