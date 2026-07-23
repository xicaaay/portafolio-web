"use client";

import { motion, useReducedMotion } from "motion/react";
import { FiArrowLeft } from "react-icons/fi";
import { useState } from "react";
import { MagneticTitle } from "./components/magnetic-title";
import { HOME_PATH } from "./components/navigation-config";
import { RouteTransitionLink } from "./components/route-transition-link";

const DIGITS = ["4", "0", "4"];

function LostAstronaut({
  excited,
  reducedMotion,
}: {
  excited: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className="not-found-astronaut"
      data-excited={excited ? "true" : undefined}
      role="img"
      aria-label={
        excited
          ? "Astronauta perdido levantando los brazos con emoción"
          : "Astronauta perdido flotando en el espacio"
      }
      initial={reducedMotion ? false : { opacity: 0, scale: 0.82, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: reducedMotion ? 0.15 : 0.9,
        delay: reducedMotion ? 0 : 0.36,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className="not-found-astronaut-orbit" aria-hidden="true" />

      <span className="not-found-astronaut-shell" aria-hidden="true">
        <i className="not-found-astronaut-backpack" />
        <i className="not-found-astronaut-arm not-found-astronaut-arm-left">
          <b />
        </i>
        <i className="not-found-astronaut-arm not-found-astronaut-arm-right">
          <b />
        </i>
        <i className="not-found-astronaut-body">
          <b />
          <b />
          <b />
        </i>
        <i className="not-found-astronaut-helmet">
          <b>
            <span />
            <span />
          </b>
        </i>
        <i className="not-found-astronaut-leg not-found-astronaut-leg-left">
          <b />
        </i>
        <i className="not-found-astronaut-leg not-found-astronaut-leg-right">
          <b />
        </i>
      </span>
    </motion.div>
  );
}

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();
  const [isReturnActive, setIsReturnActive] = useState(false);
  const reducedMotion = shouldReduceMotion ?? false;

  return (
    <main className="site-page relative grid min-h-svh overflow-hidden bg-background p-[clamp(1.25rem,3vw,3rem)] text-foreground">
      <span
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--line-soft)_0.0625rem,transparent_0.0625rem),linear-gradient(90deg,var(--line-soft)_0.0625rem,transparent_0.0625rem)] bg-[size:clamp(3rem,6vw,6rem)_clamp(3rem,6vw,6rem)] opacity-60"
        aria-hidden="true"
      />
      <span className="not-found-fog" aria-hidden="true" />

      <section className="not-found-layout relative z-10 grid content-center gap-[clamp(2rem,4vw,4rem)] py-[clamp(4rem,9vh,8rem)]">
        <div className="grid justify-items-center">
          <div className="not-found-visual-row">
            <motion.div
              className="not-found-code flex items-center justify-center font-display text-[clamp(7rem,18vw,18rem)] leading-[0.72] tracking-[-0.085em]"
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
                            y:
                              index === 1
                                ? [0, "-0.65rem", 0]
                                : [0, "0.5rem", 0],
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

            <LostAstronaut
              excited={isReturnActive}
              reducedMotion={reducedMotion}
            />
          </div>

          <motion.div
            className="relative mt-[clamp(2rem,5vh,4rem)] grid max-w-[46rem] justify-items-center gap-5 text-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: "1rem" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.28 }}
          >
            <MagneticTitle
              as="h1"
              text="Ruta no encontrada."
              className="m-0 text-[clamp(1.55rem,3vw,3.2rem)] leading-[0.98] tracking-[-0.05em]"
            />

            <p className="m-0 max-w-[38rem] text-[clamp(0.95rem,1.2vw,1.15rem)] leading-[1.7] text-[var(--muted)]">
              La dirección no existe o fue movida. Regresa al inicio para continuar
              explorando el portafolio.
            </p>

            <motion.div
              onHoverStart={() => setIsReturnActive(true)}
              onHoverEnd={() => setIsReturnActive(false)}
              onFocusCapture={() => setIsReturnActive(true)}
              onBlurCapture={() => setIsReturnActive(false)}
            >
              <RouteTransitionLink
                href={HOME_PATH}
                className="not-found-action group/back grid min-w-[clamp(13rem,20vw,17rem)] grid-cols-[auto_1fr_auto] items-center gap-[clamp(0.65rem,1vw,0.9rem)] py-1 text-foreground no-underline transition duration-300 ease-out hover:-translate-y-[0.2rem] hover:text-[var(--accent)] focus-visible:-translate-y-[0.2rem] focus-visible:text-[var(--accent)]"
              >
                <span className="grid size-[clamp(2.3rem,3vw,2.8rem)] shrink-0 place-items-center rounded-full bg-[var(--surface)] text-foreground transition duration-300 ease-out group-hover/back:-rotate-6 group-hover/back:scale-105 group-hover/back:bg-foreground group-hover/back:text-background group-focus-visible/back:-rotate-6 group-focus-visible/back:scale-105 group-focus-visible/back:bg-foreground group-focus-visible/back:text-background">
                  <FiArrowLeft aria-hidden="true" />
                </span>

                <span className="grid min-w-0 gap-[0.125rem] text-left">
                  <strong className="text-[clamp(0.82rem,0.9vw,0.96rem)] font-medium">
                    Volver al inicio
                  </strong>
                  <small className="text-[clamp(0.64rem,0.72vw,0.74rem)] text-[var(--muted)] transition-colors duration-200 group-hover/back:text-foreground group-focus-visible/back:text-foreground">
                    Recuperar la ruta
                  </small>
                </span>

                <FiArrowLeft
                  className="size-[clamp(0.8rem,1vw,0.95rem)] shrink-0 translate-x-[0.375rem] opacity-0 transition duration-300 ease-out group-hover/back:translate-x-[-0.125rem] group-hover/back:opacity-100 group-focus-visible/back:translate-x-[-0.125rem] group-focus-visible/back:opacity-100"
                  aria-hidden="true"
                />
              </RouteTransitionLink>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
