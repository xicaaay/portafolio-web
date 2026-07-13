"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type LoadingScreenProps = {
  onComplete: () => void;
};

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = shouldReduceMotion ? 650 : 2550;
    const startTime = performance.now();

    const progressTimer = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const normalized = Math.min(1, elapsed / totalDuration);
      const eased = 1 - Math.pow(1 - normalized, 3);
      setProgress(Math.min(100, Math.round(eased * 100)));
    }, 28);

    const completionTimer = window.setTimeout(() => {
      setProgress(100);
      onComplete();
    }, totalDuration);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(completionTimer);
    };
  }, [onComplete, shouldReduceMotion]);

  const progressText = String(progress).padStart(3, "0");

  return (
    <motion.section
      className="loading-screen loading-screen-editorial"
      aria-label="Cargando portafolio"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      transition={{
        duration: shouldReduceMotion ? 0.15 : 0.62,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <div className="loader-frame" aria-hidden="true">
        <span className="loader-corner loader-corner-tl" />
        <span className="loader-corner loader-corner-tr" />
        <span className="loader-corner loader-corner-bl" />
        <span className="loader-corner loader-corner-br" />
      </div>

      <header className="loader-header font-mono">
        <span>A/ PORTFOLIO</span>
        <span>FULL STACK / GT</span>
      </header>

      <div className="loader-stage">
        <motion.div
          className="loader-index font-display"
          key={Math.floor(progress / 10)}
          initial={{ opacity: 0.2, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.28 }}
          aria-hidden="true"
        >
          {progressText}
        </motion.div>

        <div className="loader-wordmark" aria-hidden="true">
          <span className="loader-wordmark-outline font-display">AMILCAR</span>
          <span
            className="loader-wordmark-fill font-display"
            style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
          >
            AMILCAR
          </span>
        </div>

        <div className="loader-status font-mono" role="status" aria-live="polite">
          <span>CONSTRUYENDO EXPERIENCIA</span>
          <span>{progressText}%</span>
        </div>
      </div>

      <footer className="loader-footer">
        <div className="loader-progress-track" aria-hidden="true">
          <motion.span
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.08, ease: "linear" }}
          />
        </div>
        <div className="loader-footer-meta font-mono">
          <span>SYSTEM READY</span>
          <span>2026</span>
        </div>
      </footer>
    </motion.section>
  );
}
