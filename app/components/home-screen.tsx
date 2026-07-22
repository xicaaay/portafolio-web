"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { RouteTransitionLink } from "./route-transition-link";

type HomeScreenProps = {
  profileImageUrl: string | null;
  publicName: string;
};

const easing = [0.22, 1, 0.36, 1] as const;

export function HomeScreen({ profileImageUrl, publicName }: HomeScreenProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(profileImageUrl) && !imageFailed;

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

          <motion.h1
            id="home-title"
            className="home-role-title font-display"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.85, ease: easing }}
          >
            <span>FULL STACK</span>
            <span className="home-role-accent">DEVELOPER</span>
          </motion.h1>

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
                delay={shouldReduceMotion ? 0 : 900}
                reducedMotion={shouldReduceMotion}
              />
              <TypingLine
                number="03"
                text={'status = "listo para crear";'}
                delay={shouldReduceMotion ? 0 : 1750}
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
            <RouteTransitionLink href="/projects" className="home-primary-link">
              Explorar proyectos
              <FiArrowUpRight aria-hidden="true" />
            </RouteTransitionLink>
            <RouteTransitionLink href="/about-me" className="home-secondary-link">
              Conocer mi perfil
            </RouteTransitionLink>
          </motion.div>
        </div>

        <motion.figure
          className="home-portrait"
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, x: 40, clipPath: "inset(0 0 100% 0 round 1.5rem)" }
          }
          animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0% 0 round 1.5rem)" }}
          transition={{ delay: 0.3, duration: 1.05, ease: easing }}
        >
          <div className="home-portrait-frame">
            {showImage && profileImageUrl ? (
              <motion.img
                src={profileImageUrl}
                alt={`Fotografía de ${publicName}`}
                loading="eager"
                decoding="async"
                onError={() => setImageFailed(true)}
                initial={shouldReduceMotion ? false : { scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.42, duration: 1.2, ease: easing }}
              />
            ) : (
              <div className="home-portrait-fallback font-display" aria-label="Espacio para fotografía">
                <span aria-hidden="true">AX</span>
              </div>
            )}
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
      }, 24);
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
      <span aria-hidden="true">{number}</span>
      <code aria-hidden="true">{text.slice(0, renderedCharacters)}</code>
      <i className={isTyping ? "is-typing" : undefined} aria-hidden="true" />
    </p>
  );
}
