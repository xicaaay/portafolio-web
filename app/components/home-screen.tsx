"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FiArrowUpRight, FiLayers, FiUser } from "react-icons/fi";
import { InteractiveCharacter } from "./interactive-character";
import { MagneticTitle } from "./magnetic-title";
import { RouteTransitionLink } from "./route-transition-link";

type HomeScreenProps = {
  publicName: string;
};

const easing = [0.22, 1, 0.36, 1] as const;

function HomeActionLink({
  href,
  label,
  detail,
  Icon,
}: {
  href: string;
  label: string;
  detail: string;
  Icon: IconType;
}) {
  return (
    <RouteTransitionLink
      href={href}
      className="home-social-action group/social inline-flex min-w-[clamp(12rem,18vw,15rem)] items-center gap-[clamp(0.65rem,1vw,0.9rem)] bg-transparent py-1 text-foreground no-underline transition duration-300 ease-out hover:-translate-y-[0.2rem] hover:text-[var(--accent)] focus-visible:-translate-y-[0.2rem] focus-visible:text-[var(--accent)]"
    >
      <span className="home-social-action-icon grid size-[clamp(2rem,2.5vw,2.3rem)] shrink-0 place-items-center rounded-full bg-[var(--surface)] text-foreground transition duration-300 ease-out group-hover/social:-rotate-6 group-hover/social:scale-105 group-hover/social:bg-foreground group-hover/social:text-background group-focus-visible/social:-rotate-6 group-focus-visible/social:scale-105 group-focus-visible/social:bg-foreground group-focus-visible/social:text-background">
        <Icon className="size-[clamp(0.85rem,1vw,1rem)]" aria-hidden="true" />
      </span>

      <span className="grid min-w-0 gap-[0.125rem]">
        <strong className="[overflow-wrap:anywhere] text-[clamp(0.82rem,0.9vw,0.96rem)] font-medium">
          {label}
        </strong>
        <small className="[overflow-wrap:anywhere] text-[clamp(0.64rem,0.72vw,0.74rem)] text-[var(--muted)] transition-colors duration-200 group-hover/social:text-foreground group-focus-visible/social:text-foreground">
          {detail}
        </small>
      </span>

      <FiArrowUpRight
        className="home-social-action-arrow ml-auto size-[clamp(0.8rem,1vw,0.95rem)] shrink-0 translate-x-[-0.375rem] translate-y-[0.375rem] opacity-0 transition duration-300 ease-out group-hover/social:translate-x-[0.125rem] group-hover/social:translate-y-[-0.125rem] group-hover/social:opacity-100 group-focus-visible/social:translate-x-[0.125rem] group-focus-visible/social:translate-y-[-0.125rem] group-focus-visible/social:opacity-100"
        aria-hidden="true"
      />
    </RouteTransitionLink>
  );
}

export function HomeScreen({ publicName }: HomeScreenProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <motion.section
      className="home-hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.15 : 0.72, ease: easing }}
      aria-labelledby="home-title"
    >
      <div className="home-hero-grid" aria-hidden="true" />

      <div className="home-hero-layout">
        <div className="home-hero-copy">
          <motion.p
            className="home-hero-kicker font-mono"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55, ease: easing }}
          >
            <span>00 / PORTADA</span>
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.85, ease: easing }}
          >
            <MagneticTitle
              as="h1"
              id="home-title"
              text="FULL STACK DEVELOPER"
              className="home-role-title font-display"
              breakBeforeLast
              appearance="last-outline"
            />
          </motion.div>

          <motion.div
            className="home-name-row"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.38, duration: 0.68, ease: easing }}
          >
            <span aria-hidden="true" />
            <p>{publicName}</p>
          </motion.div>

          <motion.p
            className="home-hero-description"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.65, ease: easing }}
          >
            Diseño y construyo productos digitales completos: interfaces claras,
            sistemas sólidos, APIs e integraciones que convierten ideas en
            experiencias útiles.
          </motion.p>

          <motion.div
            className="home-code-panel font-mono"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56, duration: 0.65, ease: easing }}
            aria-label="Presentación profesional en formato de código"
          >
            <div className="home-code-header">
              <span><i /><i /><i /></span>
              <span>portfolio.ts</span>
              <span>UTF-8</span>
            </div>
            <div className="home-code-body">
              <TypingLine
                number="01"
                text={`const developer = "${publicName}";`}
                delay={shouldReduceMotion ? 0 : 250}
                reducedMotion={shouldReduceMotion}
              />
              <TypingLine
                number="02"
                text={'stack.build(["front-end", "back-end", "APIs"]);'}
                delay={shouldReduceMotion ? 0 : 2500}
                reducedMotion={shouldReduceMotion}
              />
              <TypingLine
                number="03"
                text={'status = "listo para crear";'}
                delay={shouldReduceMotion ? 0 : 5500}
                reducedMotion={shouldReduceMotion}
              />
            </div>
          </motion.div>

          <motion.div
            className="home-hero-actions"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.6, ease: easing }}
          >
            <HomeActionLink
              href="/projects"
              label="Explorar proyectos"
              detail="Ver trabajo seleccionado"
              Icon={FiLayers}
            />
            <HomeActionLink
              href="/about-me"
              label="Conocer mi perfil"
              detail="Sobre mí y mi enfoque"
              Icon={FiUser}
            />
          </motion.div>
        </div>

        <motion.figure
          className="home-portrait"
          aria-label="Personaje interactivo que sigue el puntero y puede saltar"
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, x: 40, clipPath: "inset(0 0 100% 0 round 1.5rem)" }
          }
          animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0% 0 round 1.5rem)" }}
          transition={{ delay: 0.3, duration: 1.05, ease: easing }}
        >
          <div className="home-portrait-frame">
            <motion.div
              className="home-character-intro"
              initial={shouldReduceMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.52, duration: 0.8, ease: easing }}
            >
              <InteractiveCharacter ariaLabel="Hacer saltar al personaje" />
            </motion.div>
            <span className="home-portrait-corner home-portrait-corner-top" aria-hidden="true" />
            <span className="home-portrait-corner home-portrait-corner-bottom" aria-hidden="true" />
          </div>
      
        </motion.figure>
      </div>

    </motion.section>
  );
}

type TypingLineProps = {
  number: string;
  text: string;
  delay: number;
  reducedMotion: boolean;
};

function TypingLine({ number, text, delay, reducedMotion }: TypingLineProps) {
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;

    let intervalId = 0;
    const startTimer = window.setTimeout(() => {
      setVisibleCharacters(0);
      intervalId = window.setInterval(() => {
        setVisibleCharacters((current) => {
          if (current >= text.length) {
            window.clearInterval(intervalId);
            return current;
          }
          return current + 1;
        });
      }, 56);
    }, delay);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(intervalId);
    };
  }, [delay, reducedMotion, text]);

  const renderedCharacters = reducedMotion ? text.length : visibleCharacters;
  const isTyping = renderedCharacters < text.length;

  return (
    <p aria-label={text}>
      <span className="home-code-line-number" aria-hidden="true">{number}</span>
      <span className="home-code-line-content" aria-hidden="true">
        <code>{text.slice(0, renderedCharacters)}</code>
        <i className={isTyping ? "is-typing" : undefined} />
      </span>
    </p>
  );
}
