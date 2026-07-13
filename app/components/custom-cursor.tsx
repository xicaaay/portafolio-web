"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

type CursorMode = "default" | "action" | "grow";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { stiffness: 500, damping: 36, mass: 0.35 });
  const smoothY = useSpring(cursorY, { stiffness: 500, damping: 36, mass: 0.35 });
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    if (!finePointer.matches) {
      return;
    }

    document.documentElement.classList.add("custom-cursor-enabled");

    const handlePointerMove = (event: PointerEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      setVisible(true);

      const target = event.target instanceof Element ? event.target : null;
      const cursorTarget = target?.closest<HTMLElement>("[data-cursor]");
      const nextMode = cursorTarget?.dataset.cursor as CursorMode | undefined;
      setMode(nextMode ?? "default");
    };

    const handlePointerLeave = () => setVisible(false);
    const handlePointerEnter = () => setVisible(true);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);
    document.addEventListener("mouseenter", handlePointerEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("mouseenter", handlePointerEnter);
    };
  }, [cursorX, cursorY]);


  const ringScale = mode === "grow" ? 2.05 : mode === "action" ? 1.45 : 1;
  const dotScale = mode === "grow" ? 0.55 : mode === "action" ? 1.25 : 1;

  return (
    <div className="custom-cursor" aria-hidden="true">
      <motion.div
        className="custom-cursor-ring"
        style={{ x: smoothX, y: smoothY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: ringScale,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <motion.div
        className="custom-cursor-dot"
        style={{ x: cursorX, y: cursorY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: dotScale,
        }}
        transition={{ duration: 0.14, ease: "easeOut" }}
      />
    </div>
  );
}
