"use client";

/* eslint-disable @next/next/no-img-element */

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import styles from "./profile-badge.module.css";

type ProfileBadgeProps = {
  name: string | null;
  headline: string | null;
  imageUrl: string | null;
  interactive?: boolean;
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
}: ProfileBadgeProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [imageFailed, setImageFailed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <div className={styles.stage}>
      <motion.figure
        className={styles.badge}
        drag={interactive && !shouldReduceMotion}
        dragConstraints={{ top: -105, right: 105, bottom: 105, left: -105 }}
        dragElastic={0.68}
        dragMomentum={false}
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 320, bounceDamping: 12 }}
        whileDrag={{ scale: 1.035, rotate: 1.6 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        data-dragging={isDragging ? "true" : undefined}
        data-static={!interactive ? "true" : undefined}
        data-cursor={interactive ? "action" : undefined}
        aria-label={
          interactive
            ? `Carnet de ${name ?? "perfil profesional"}. Arrástralo y suéltalo para hacerlo rebotar.`
            : `Carnet de ${name ?? "perfil profesional"}`
        }
      >
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
      </motion.figure>
    </div>
  );
}
