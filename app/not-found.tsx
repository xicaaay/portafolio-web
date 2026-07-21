"use client";

import { motion, useReducedMotion } from "motion/react";
import { FiArrowLeft, FiCompass } from "react-icons/fi";
import { RouteTransitionLink } from "./components/route-transition-link";
import { SectionNavigation } from "./components/section-navigation";

const DIGITS = ["4", "0", "4"];

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative grid min-h-svh grid-rows-[auto_1fr_auto] overflow-hidden bg-background p-[clamp(1.25rem,3vw,3rem)] text-foreground">
      <span
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--line-soft)_0.0625rem,transparent_0.0625rem),linear-gradient(90deg,var(--line-soft)_0.0625rem,transparent_0.0625rem)] bg-[size:clamp(3rem,6vw,6rem)_clamp(3rem,6vw,6rem)] opacity-60"
        aria-hidden="true"
      />

      <header className="internal-header relative z-10">
        <RouteTransitionLink href="/" className="internal-brand font-display">
          AX
        </RouteTransitionLink>
        <span className="internal-header-meta font-mono">ERROR / 404</span>
      </header>

      <section className="relative z-10 grid content-center gap-[clamp(2rem,4vw,4rem)] py-[clamp(4rem,9vh,8rem)]">
        <div className="grid justify-items-center">
          <motion.div
            className="flex items-center justify-center font-display text-[clamp(8rem,31vw,31rem)] leading-[0.66] tracking-[-0.095em]"
            initial={shouldReduceMotion ? false : "hidden"}
            animate="visible"
            aria-label="Error 404"
          >
            {DIGITS.map((digit, index) => (
              <motion.span
                className="inline-grid"
                key={`${digit}-${index}`}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: index === 1 ? "-2rem" : "2rem",
                    rotate: index === 1 ? -5 : 4,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    transition: {
                      duration: 0.78,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
              >
                <motion.span
                  className="relative inline-grid transition-colors duration-300 hover:text-transparent hover:[-webkit-text-stroke:clamp(0.0625rem,0.015em,0.12rem)_var(--foreground)]"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: index === 1 ? [0, "-0.65rem", 0] : [0, "0.5rem", 0],
                        }
                  }
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : {
                          duration: 3.2 + index * 0.35,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                >
                  {digit}
                </motion.span>
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className="relative -mt-[clamp(0.5rem,2vw,2rem)] grid max-w-[46rem] justify-items-center gap-5 text-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: "1rem" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.28 }}
          >
            <span
              className="grid size-[clamp(3rem,5vw,4.5rem)] place-items-center rounded-full border border-[var(--line)] text-[var(--accent)] transition-transform duration-300 hover:scale-110"
              data-blue-icon
            >
              <FiCompass className="size-[clamp(1.2rem,2vw,1.8rem)]" aria-hidden="true" />
            </span>

            <p className="m-0 font-mono text-[clamp(0.62rem,0.74vw,0.8rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
              RUTA NO ENCONTRADA
            </p>

            <h1 className="m-0 text-[clamp(1.8rem,4vw,4rem)] leading-[0.98] tracking-[-0.05em]">
              Esta página salió del mapa.
            </h1>

            <p className="m-0 max-w-[38rem] text-[clamp(0.95rem,1.2vw,1.15rem)] leading-[1.7] text-[var(--muted)]">
              La dirección no existe o fue movida. Regresa al inicio para continuar
              explorando el portafolio.
            </p>

            <RouteTransitionLink
              href="/"
              className="group/back inline-flex items-center gap-4 bg-foreground px-[clamp(1rem,2vw,1.4rem)] py-[clamp(0.85rem,1.3vw,1.05rem)] text-background no-underline transition duration-300 hover:-translate-y-[0.2rem] hover:bg-[var(--accent)] focus-visible:-translate-y-[0.2rem] focus-visible:bg-[var(--accent)]"
            >
              <FiArrowLeft className="transition-transform duration-300 group-hover/back:-translate-x-[0.2rem]" aria-hidden="true" />
              Regresar al inicio
            </RouteTransitionLink>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10">
        <SectionNavigation />
      </div>
    </main>
  );
}
