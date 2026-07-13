"use client";

import { motion, useReducedMotion } from "motion/react";
import { FiArrowRight, FiMoon, FiSun } from "react-icons/fi";
import type { ThemeMode } from "./portfolio-experience";

type ThemeSelectorProps = {
  currentTheme: ThemeMode;
  onSelect: (theme: ThemeMode) => void;
};

const themeOptions = [
  {
    id: "light" as const,
    label: "Claro",
    helper: "Fondo claro",
    icon: FiSun,
  },
  {
    id: "dark" as const,
    label: "Oscuro",
    helper: "Fondo oscuro",
    icon: FiMoon,
  },
];

export function ThemeSelector({ currentTheme, onSelect }: ThemeSelectorProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className="theme-selector-compact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
      transition={{
        duration: shouldReduceMotion ? 0.15 : 0.48,
        ease: [0.76, 0, 0.24, 1],
      }}
      aria-labelledby="theme-selector-title"
    >
      <div className="theme-selector-backdrop" aria-hidden="true" />

      <motion.div
        className="theme-dialog"
        initial={{ opacity: 0, y: 22, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: shouldReduceMotion ? 0 : 0.12,
          duration: shouldReduceMotion ? 0.15 : 0.54,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="theme-dialog-top font-mono">
          <span className="theme-dialog-dot" aria-hidden="true" />
          <span>APARIENCIA</span>
          <span>01/02</span>
        </div>

        <div className="theme-dialog-copy">
          <p className="font-mono">ANTES DE ENTRAR</p>
          <h1 id="theme-selector-title" className="font-display">
            ELIGE TEMA
          </h1>
        </div>

        <div className="theme-choice-list">
          {themeOptions.map((option, index) => {
            const Icon = option.icon;
            const isSuggested = option.id === currentTheme;

            return (
              <motion.button
                key={option.id}
                type="button"
                className="theme-choice"
                onClick={() => onSelect(option.id)}
                aria-label={`Usar tema ${option.label}`}
                data-cursor="action"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.22 + index * 0.06,
                  duration: 0.42,
                }}
                whileHover={shouldReduceMotion ? undefined : { x: 3 }}
                whileTap={{ scale: 0.985 }}
              >
                <span className="theme-choice-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="theme-choice-copy">
                  <strong className="font-body">{option.label}</strong>
                  <small className="font-mono">{option.helper}</small>
                </span>
                {isSuggested && (
                  <span className="theme-choice-suggested font-mono">SUGERIDO</span>
                )}
                <FiArrowRight className="theme-choice-arrow" aria-hidden="true" />
              </motion.button>
            );
          })}
        </div>

        <p className="theme-dialog-note font-mono">
          PODRÁS CAMBIARLO DESPUÉS
        </p>
      </motion.div>
    </motion.section>
  );
}
