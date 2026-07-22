"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import { MagneticTitle } from "../components/magnetic-title";
import type { PublicProjectImage } from "../lib/public-api";
import styles from "./projects.module.css";

export function GalleryLightbox({ images, projectTitle, onClose, initialIndex = 0 }: {
  images: PublicProjectImage[];
  projectTitle: string;
  onClose: () => void;
  initialIndex?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeImage = images[activeIndex];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setActiveIndex((current) => (current + 1) % images.length);
      if (event.key === "ArrowLeft") setActiveIndex((current) => (current - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length, onClose]);

  if (!activeImage) return null;

  return (
    <motion.div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${projectTitle}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.08 : 0.28 }}
    >
      <div className={styles.lightboxFrame} aria-hidden="true">
        <span className={`${styles.lightboxCorner} ${styles.lightboxCornerTl}`} />
        <span className={`${styles.lightboxCorner} ${styles.lightboxCornerTr}`} />
        <span className={`${styles.lightboxCorner} ${styles.lightboxCornerBl}`} />
        <span className={`${styles.lightboxCorner} ${styles.lightboxCornerBr}`} />
      </div>

      <header className={styles.lightboxHeader}>
        <div>
          <span>Galería</span>
          <MagneticTitle as="strong" text={projectTitle} className={styles.lightboxTitle} />
          <small>Cierra con × o presiona ESC</small>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar galería" data-cursor="action" autoFocus>
          <FiX aria-hidden="true" />
        </button>
      </header>

      <div className={styles.lightboxStage}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={activeImage.id}
            src={activeImage.url}
            alt={activeImage.altText ?? `${projectTitle}, imagen ${activeIndex + 1}`}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.975 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.015 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
          />
        </AnimatePresence>
      </div>

      <footer className={styles.lightboxFooter}>
        <p>{activeImage.title ?? activeImage.altText ?? "Vista del proyecto"}</p>
        <div className={styles.lightboxControls}>
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
          {images.length > 1 && (
            <>
              <button type="button" onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)} aria-label="Imagen anterior" data-cursor="action">
                <FiArrowLeft aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setActiveIndex((activeIndex + 1) % images.length)} aria-label="Imagen siguiente" data-cursor="action">
                <FiArrowRight aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </footer>
    </motion.div>
  );
}
