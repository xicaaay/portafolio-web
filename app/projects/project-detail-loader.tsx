"use client";

import { motion } from "motion/react";

export function ProjectDetailLoader({ title }: { title: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-[260] grid place-items-center bg-[color-mix(in_srgb,var(--background)_88%,transparent)] p-5 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-live="polite"
      aria-label={`Cargando detalles de ${title}`}
    >
      <div className="soft-panel grid w-full max-w-[32rem] gap-6 p-[clamp(1.5rem,4vw,3rem)]">
        <div className="flex items-center justify-between gap-5 font-mono text-[clamp(0.6rem,0.72vw,0.78rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
          <span>ABRIENDO PROYECTO</span>
          <span>AX / CASE</span>
        </div>

        <h2 className="m-0 text-[clamp(1.8rem,4vw,3.75rem)] leading-[0.95] tracking-[-0.055em]">
          {title}
        </h2>

        <div className="grid gap-2" aria-hidden="true">
          {[0, 1, 2].map((line) => (
            <motion.span
              key={line}
              className="block h-[0.125rem] origin-left bg-foreground"
              initial={{ scaleX: 0, opacity: 0.22 }}
              animate={{ scaleX: [0, 1, 0], opacity: [0.22, 1, 0.22] }}
              transition={{
                duration: 1.15,
                delay: line * 0.12,
                repeat: Number.POSITIVE_INFINITY,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
