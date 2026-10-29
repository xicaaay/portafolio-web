"use client";

import { motion, useScroll, useTransform } from "motion/react";

import styles from "./scroll-hint.module.css";

/*
 * Flecha flotante que indica que la página continúa hacia abajo. Como la barra de scroll está
 * oculta, es la pista visible: se ve arriba del todo y se desvanece al empezar a bajar.
 */
export function ScrollHint({ href, label }: { href: string; label: string }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 120], [1, 0]);
  /* Oculta (y fuera del orden de tabulación) cuando ya no se ve. */
  const visibility = useTransform(opacity, (value) => (value <= 0.02 ? "hidden" : "visible"));

  return (
    <motion.a aria-label={label} className={styles.hint} href={href} style={{ opacity, visibility }}>
      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
        <path d="M12 4v15M6 13l6 6 6-6" />
      </svg>
    </motion.a>
  );
}
