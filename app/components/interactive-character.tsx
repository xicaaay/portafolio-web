"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { AnimationEvent as ReactAnimationEvent } from "react";

type InteractiveCharacterProps = {
  variant?: "hero" | "brand";
  ariaLabel?: string;
  disabled?: boolean;
  onJumpComplete?: () => void;
};

export function InteractiveCharacter({
  variant = "hero",
  ariaLabel = "Hacer saltar al personaje",
  disabled = false,
  onJumpComplete,
}: InteractiveCharacterProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const characterRef = useRef<HTMLButtonElement>(null);
  const gazeFrameRef = useRef<number | null>(null);
  const reducedMotionTimerRef = useRef<number | null>(null);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    const updateGaze = (event: PointerEvent) => {
      if (
        shouldReduceMotion ||
        isJumping ||
        disabled ||
        event.pointerType !== "mouse"
      ) {
        return;
      }

      if (gazeFrameRef.current !== null) {
        window.cancelAnimationFrame(gazeFrameRef.current);
      }

      const pointerX = event.clientX;
      const pointerY = event.clientY;

      gazeFrameRef.current = window.requestAnimationFrame(() => {
        gazeFrameRef.current = null;
        const character = characterRef.current;
        const head = character?.querySelector<HTMLElement>(".home-character-head");
        if (!character || !head) return;

        const bounds = head.getBoundingClientRect();
        const deltaX = pointerX - (bounds.left + bounds.width / 2);
        const deltaY = pointerY - (bounds.top + bounds.height / 2);
        const distance = Math.hypot(deltaX, deltaY);
        const travel = Math.min(variant === "brand" ? 2.4 : 6, distance * 0.08);
        const angle = Math.atan2(deltaY, deltaX);

        character.style.setProperty("--eye-x", `${Math.cos(angle) * travel}px`);
        character.style.setProperty("--eye-y", `${Math.sin(angle) * travel}px`);
      });
    };

    window.addEventListener("pointermove", updateGaze, { passive: true });

    return () => {
      window.removeEventListener("pointermove", updateGaze);

      if (gazeFrameRef.current !== null) {
        window.cancelAnimationFrame(gazeFrameRef.current);
      }
    };
  }, [disabled, isJumping, shouldReduceMotion, variant]);

  useEffect(
    () => () => {
      if (reducedMotionTimerRef.current !== null) {
        window.clearTimeout(reducedMotionTimerRef.current);
      }
    },
    [],
  );

  const finishJump = () => {
    setIsJumping(false);
    onJumpComplete?.();
  };

  const makeCharacterJump = () => {
    if (isJumping || disabled) return;

    setIsJumping(true);

    if (shouldReduceMotion) {
      reducedMotionTimerRef.current = window.setTimeout(finishJump, 140);
    }
  };

  const handleAnimationEnd = (
    event: ReactAnimationEvent<HTMLSpanElement>,
  ) => {
    if (event.animationName === "home-character-jump") {
      finishJump();
    }
  };

  return (
    <button
      ref={characterRef}
      className={`home-character home-character-${variant}${isJumping ? " is-jumping" : ""}`}
      type="button"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      data-cursor="action"
      onClick={makeCharacterJump}
    >
      <span
        className="home-character-motion"
        onAnimationEnd={handleAnimationEnd}
        aria-hidden="true"
      >
        <span className="home-character-head">
          <span className="home-character-eye home-character-eye-left" />
          <span className="home-character-eye home-character-eye-right" />
        </span>
      </span>
      <span className="home-character-shadow" aria-hidden="true" />
      <span className="home-character-dust" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </span>
    </button>
  );
}
