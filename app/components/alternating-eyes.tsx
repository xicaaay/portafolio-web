"use client";

import { useEffect, useState } from "react";
import styles from "./alternating-eyes.module.css";

type AlternatingEyesProps = {
  variant?: "profile" | "contact";
  className?: string;
};

export function AlternatingEyes({
  variant = "profile",
  className = "",
}: AlternatingEyesProps) {
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    if (isActivated) return;

    const activateSequence = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      setIsActivated(true);
    };

    window.addEventListener("pointermove", activateSequence, { passive: true });

    return () => window.removeEventListener("pointermove", activateSequence);
  }, [isActivated]);

  return (
    <div
      className={`${styles.frame} ${styles[variant]} ${isActivated ? styles.active : ""} ${className}`.trim()}
      role="img"
      aria-label="Dos ojos que parpadean y luego hacen un guiño"
    >
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.eyes} aria-hidden="true">
        <span className={`${styles.eye} ${styles.leftEye}`} />
        <span className={`${styles.eye} ${styles.rightEye}`} />
      </span>
    </div>
  );
}
