"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import styles from "./scroll-controls.module.css";

type ScrollControlsProps = {
  hidden?: boolean;
};

type ScrollStatus = {
  canScroll: boolean;
  isAtBottom: boolean;
};

const INITIAL_STATUS: ScrollStatus = {
  canScroll: false,
  isAtBottom: false,
};

export function ScrollControls({ hidden = false }: ScrollControlsProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const frameRef = useRef<number | null>(null);
  const [status, setStatus] = useState<ScrollStatus>(INITIAL_STATUS);

  const updateStatus = useCallback(() => {
    const documentElement = document.documentElement;
    const scrollHeight = Math.max(
      documentElement.scrollHeight,
      document.body.scrollHeight,
    );
    const maximumScroll = Math.max(0, scrollHeight - window.innerHeight);
    const canScroll = maximumScroll > 16;
    const isAtBottom =
      canScroll && window.scrollY >= Math.max(0, maximumScroll - 8);

    setStatus((currentStatus) => {
      if (
        currentStatus.canScroll === canScroll &&
        currentStatus.isAtBottom === isAtBottom
      ) {
        return currentStatus;
      }

      return { canScroll, isAtBottom };
    });
  }, []);

  useEffect(() => {
    const scheduleUpdate = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateStatus();
      });
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    const settledContentTimeout = window.setTimeout(scheduleUpdate, 400);

    return () => {
      window.clearTimeout(settledContentTimeout);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver.disconnect();

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [pathname, updateStatus]);

  const scrollDown = () => {
    const maximumScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const nextPosition = Math.min(
      maximumScroll,
      window.scrollY + Math.max(320, window.innerHeight * 0.72),
    );

    window.scrollTo({
      top: nextPosition,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const isVisible = status.canScroll && !hidden;
  const direction = status.isAtBottom ? "up" : "down";

  return (
    <div className={styles.positioner}>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.button
            key={direction}
            type="button"
            className={`${styles.control} ${
              status.isAtBottom ? styles.up : styles.down
            }`}
            onClick={status.isAtBottom ? scrollToTop : scrollDown}
            aria-label={
              status.isAtBottom
                ? "Volver al inicio de la página"
                : "Bajar para ver más contenido"
            }
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 12, scale: 0.92 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: status.isAtBottom ? 10 : -10, scale: 0.92 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.28 }}
          >
            <span className={styles.icon} aria-hidden="true">
              {status.isAtBottom ? <FiArrowUp /> : <FiArrowDown />}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
