"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { CSSProperties, PointerEvent } from "react";
import { useState } from "react";
import styles from "./magnetic-title.module.css";

type MagneticTitleTag = "h1" | "h2" | "h3" | "strong";

type MagneticTitleProps = {
  text: string;
  as?: MagneticTitleTag;
  id?: string;
  className?: string;
  style?: CSSProperties;
  fullWidth?: boolean;
  breakBeforeLast?: boolean;
  appearance?: "solid" | "outline" | "last-outline";
};

type WordRevealStyle = CSSProperties & {
  "--typing-delay": string;
  "--typing-duration": string;
  "--typing-steps": number;
};

function MagneticWord({
  word,
  isLast,
  revealDelay,
}: {
  word: string;
  isLast: boolean;
  revealDelay: number;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isActive, setIsActive] = useState(false);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, { stiffness: 150, damping: 13, mass: 0.34 });
  const springY = useSpring(offsetY, { stiffness: 150, damping: 13, mass: 0.34 });
  const revealDuration = Math.max(0.24, Array.from(word).length * 0.052);
  const revealStyle: WordRevealStyle = {
    "--typing-delay": `${revealDelay}s`,
    "--typing-duration": `${revealDuration}s`,
    "--typing-steps": Math.max(1, Array.from(word).length),
  };

  const release = () => {
    setIsActive(false);
    offsetX.set(0);
    offsetY.set(0);
  };

  const followPointer = (event: PointerEvent<HTMLSpanElement>) => {
    if (shouldReduceMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const distanceX = event.clientX - (bounds.left + bounds.width / 2);
    const distanceY = event.clientY - (bounds.top + bounds.height / 2);

    setIsActive(true);
    offsetX.set(Math.max(-15, Math.min(15, distanceX * 0.16)));
    offsetY.set(Math.max(-10, Math.min(10, distanceY * 0.22)));
  };

  return (
    <motion.span
      className={`${styles.word} ${isLast ? styles.lastWord : ""}`}
      style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
      animate={{ scale: isActive && !shouldReduceMotion ? 1.035 : 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 14 }}
      onPointerMove={followPointer}
      onPointerLeave={release}
      data-magnetic-active={isActive ? "true" : undefined}
      data-cursor="action"
      aria-hidden="true"
    >
      <span className={styles.reveal} style={revealStyle}>
        <span className={styles.fill}>{word}</span>
        <span className={styles.outline}>{word}</span>
      </span>
    </motion.span>
  );
}

export function MagneticTitle({
  text,
  as: Tag = "h2",
  id,
  className = "",
  style,
  fullWidth = false,
  breakBeforeLast = false,
  appearance = "solid",
}: MagneticTitleProps) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const revealDelays = words.map((_, index) => {
    const precedingCharacters = words
      .slice(0, index)
      .reduce((total, word) => total + Array.from(word).length + 1, 0);

    return 0.12 + precedingCharacters * 0.052;
  });

  return (
    <Tag
      id={id}
      className={`${styles.title} ${appearance === "solid" ? styles.solid : appearance === "last-outline" ? styles.lastOutline : ""} ${fullWidth ? styles.fullWidth : ""} ${className}`.trim()}
      style={style}
      aria-label={text}
    >
      {words.map((word, index) => {
        return (
          <span key={`${word}-${index}`} className="contents">
            {breakBeforeLast && index === words.length - 1 && (
              <span className={styles.break} aria-hidden="true" />
            )}
            <MagneticWord
              word={word}
              isLast={index === words.length - 1}
              revealDelay={revealDelays[index]}
            />
          </span>
        );
      })}
    </Tag>
  );
}
