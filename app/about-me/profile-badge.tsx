"use client";

/* eslint-disable @next/next/no-img-element */

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import styles from "./profile-badge.module.css";

type ProfileBadgeProps = {
  name: string | null;
  headline: string | null;
  imageUrl: string | null;
  interactive?: boolean;
  compact?: boolean;
};

function getInitials(name: string | null) {
  if (!name) return "AX";

  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words.at(0)?.charAt(0) ?? "A";
  const last = words.at(-1)?.charAt(0) ?? "X";

  return `${first}${last}`.toUpperCase();
}

export function ProfileBadge({
  name,
  headline,
  imageUrl,
  interactive = true,
  compact = false,
}: ProfileBadgeProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [imageFailed, setImageFailed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const dragGuardRef = useRef(false);
  const showImage = Boolean(imageUrl) && !imageFailed;

  const flipBadge = () => {
    if (!interactive || dragGuardRef.current) return;
    setIsFlipped((current) => !current);
  };

  return (
    <div className={styles.stage} data-compact={compact ? "true" : undefined}>
      <motion.figure
        className={styles.badge}
        drag={interactive && !shouldReduceMotion}
        dragConstraints={{ top: -105, right: 105, bottom: 105, left: -105 }}
        dragElastic={0.68}
        dragMomentum={false}
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 320, bounceDamping: 12 }}
        whileDrag={{ scale: 1.035, rotate: 1.6 }}
        onDragStart={() => {
          dragGuardRef.current = true;
          setIsDragging(true);
        }}
        onDragEnd={() => {
          setIsDragging(false);
          window.setTimeout(() => {
            dragGuardRef.current = false;
          }, 0);
        }}
        onClick={flipBadge}
        onKeyDown={(event) => {
          if (!interactive || (event.key !== "Enter" && event.key !== " ")) {
            return;
          }
          event.preventDefault();
          flipBadge();
        }}
        data-dragging={isDragging ? "true" : undefined}
        data-static={!interactive ? "true" : undefined}
        data-flipped={isFlipped ? "true" : undefined}
        data-cursor={interactive ? "action" : undefined}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-pressed={interactive ? isFlipped : undefined}
        aria-label={
          interactive
            ? `Carnet de ${name ?? "perfil profesional"}. Haz clic para ver la otra cara o arrástralo y suéltalo para hacerlo rebotar.`
            : `Carnet de ${name ?? "perfil profesional"}`
        }
      >
        <div className={styles.cardInner}>
          <div className={`${styles.face} ${styles.front}`}>
            <span className={styles.grip} aria-hidden="true" />

            <div className={styles.photo}>
              {showImage && imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name ? `Fotografía de ${name}` : "Fotografía de perfil"}
                  draggable={false}
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <span aria-hidden="true">{getInitials(name)}</span>
              )}
            </div>

            <figcaption className={styles.identity}>
              <strong>{name ?? "Amilcar Xicay"}</strong>
              <span>{headline ?? "Full Stack Developer"}</span>
            </figcaption>
          </div>

          <div className={`${styles.face} ${styles.back}`} aria-hidden={!isFlipped}>
            <img
              src="/image.jpeg"
              alt="Ilustración Absolute Cinema"
              draggable={false}
            />
          </div>
        </div>
      </motion.figure>
    </div>
  );
}
