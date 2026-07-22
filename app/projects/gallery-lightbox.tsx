"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
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
    <motion.div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={`Galería de ${projectTitle}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: shouldReduceMotion ? 0.08 : 0.28 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <header className={styles.lightboxHeader}>
        <div><span>Galería</span><strong>{projectTitle}</strong></div>
        <button type="button" onClick={onClose} aria-label="Cerrar galería" data-cursor="action"><FiX aria-hidden="true" /></button>
      </header>
      <div className={styles.lightboxStage}>
        <motion.img key={activeImage.id} src={activeImage.url} alt={activeImage.altText ?? `${projectTitle}, imagen ${activeIndex + 1}`} initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.32 }} />
      </div>
      <footer className={styles.lightboxFooter}>
        <p>{activeImage.title ?? activeImage.altText ?? "Vista del proyecto"}</p>
        <div className={styles.lightboxControls}>
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
          {images.length > 1 && <>
            <button type="button" onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)} aria-label="Imagen anterior" data-cursor="action"><FiArrowLeft aria-hidden="true" /></button>
            <button type="button" onClick={() => setActiveIndex((activeIndex + 1) % images.length)} aria-label="Imagen siguiente" data-cursor="action"><FiArrowRight aria-hidden="true" /></button>
          </>}
        </div>
      </footer>
    </motion.div>
  );
}
