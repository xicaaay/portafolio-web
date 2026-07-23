"use client";

/* eslint-disable @next/next/no-img-element */

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  type PointerEvent as ReactPointerEvent,
  useRef,
  useState,
} from "react";
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
  const [isMagneticActive, setIsMagneticActive] = useState(false);
  const dragGuardRef = useRef(false);
  const showImage = Boolean(imageUrl) && !imageFailed;
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const springX = useSpring(magneticX, {
    stiffness: 118,
    damping: 11,
    mass: 0.42,
  });
  const springY = useSpring(magneticY, {
    stiffness: 118,
    damping: 11,
    mass: 0.42,
  });

  const flipBadge = () => {
    if (!interactive || dragGuardRef.current) return;
    setIsFlipped((current) => !current);
  };

  const releaseMagnet = () => {
    setIsMagneticActive(false);
    magneticX.set(0);
    magneticY.set(0);
  };

  const followPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !interactive ||
      shouldReduceMotion ||
      isDragging ||
      event.pointerType !== "mouse"
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const distanceX = event.clientX - (bounds.left + bounds.width / 2);
    const distanceY = event.clientY - (bounds.top + bounds.height / 2);

    setIsMagneticActive(true);
    magneticX.set(Math.max(-24, Math.min(24, distanceX * 0.28)));
    magneticY.set(Math.max(-18, Math.min(18, distanceY * 0.34)));
  };

  return (
    <div className={styles.stage} data-compact={compact ? "true" : undefined}>
      <motion.div
        className={styles.magneticBadge}
        style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
        animate={{
          scale:
            !shouldReduceMotion && isMagneticActive && !isDragging ? 1.025 : 1,
        }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        onPointerMove={followPointer}
        onPointerLeave={releaseMagnet}
        onFocus={() => {
          if (interactive) setIsMagneticActive(true);
        }}
        onBlur={releaseMagnet}
        data-magnetic-active={isMagneticActive ? "true" : undefined}
      >
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
            releaseMagnet();
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
      </motion.div>
    </div>
  );
}
