"use client";

import { motion } from "motion/react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useEffect, useState } from "react";
import { usePortfolio } from "./portfolio-shell";

export function ThemeToggle() {
  const { theme, toggleTheme } = usePortfolio();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const effectiveTheme = isMounted ? theme : "light";
  const label =
    effectiveTheme === "light"
      ? "Cambiar a modo oscuro"
      : "Cambiar a modo claro";

  return (
    <motion.button
      type="button"
      className="theme-toggle theme-toggle-fixed"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      data-cursor="action"
      whileTap={{ scale: 0.9 }}
    >
      {effectiveTheme === "light" ? (
        <FiMoon aria-hidden="true" />
      ) : (
        <FiSun aria-hidden="true" />
      )}
    </motion.button>
  );
}
