"use client";

import { motion, useReducedMotion } from "motion/react";

export function ProjectDetailLoader({ title }: { title: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-[450] grid grid-rows-[auto_1fr_auto] bg-[#090a0b] p-[clamp(1.25rem,3vw,3rem)] text-[#f4f4f0]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.08 : 0.3 }}
      role="status" aria-live="polite" aria-label={`Cargando ${title}`}
    >
      <div className="flex items-center justify-between font-mono text-[clamp(0.58rem,0.68vw,0.72rem)] tracking-[0.1em] text-white/50 uppercase">
        <span>Amilcar Xicay</span><span>Cargando caso</span>
      </div>
      <div className="grid place-items-center">
        <div className="grid w-full max-w-[64rem] gap-6 text-center">
          <span className="font-mono text-[clamp(0.6rem,0.75vw,0.78rem)] tracking-[0.12em] text-white/50 uppercase">Abriendo proyecto</span>
          <motion.h2
            className="m-0 text-[clamp(2.5rem,8vw,8rem)] leading-[0.88] font-medium tracking-[-0.065em]"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >{title}</motion.h2>
          <div className="mx-auto mt-4 h-px w-full max-w-[22rem] overflow-hidden bg-white/15" aria-hidden="true">
            <motion.span className="block h-full bg-white" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: [0.76, 0, 0.24, 1] }} />
          </div>
        </div>
      </div>
      <span className="font-mono text-[clamp(0.56rem,0.65vw,0.7rem)] tracking-[0.1em] text-white/40 uppercase">Preparando imágenes y detalles</span>
    </motion.div>
  );
}
