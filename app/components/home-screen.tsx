"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { FiCode, FiMapPin, FiMonitor } from "react-icons/fi";
import { SECTION_ITEMS } from "./navigation-config";
import { RouteTransitionLink } from "./route-transition-link";

const menuContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.24,
    },
  },
};

const menuItem = {
  hidden: {
    opacity: 0,
    x: 130,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.82,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function HomeScreen() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const enablePointerHover = () => {
      section.classList.add("is-pointer-ready");
    };

    window.addEventListener("pointermove", enablePointerHover, {
      once: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", enablePointerHover);
    };
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      id="inicio"
      className="portfolio-home"
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.15 : 0.85,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <div className="home-content">
        <aside className="home-sidebar">
          <motion.div
            className="identity-block"
            initial={{ opacity: 0, x: -52 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.46,
              duration: 0.78,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="identity-heading">
              <h1 className="wordmark font-display" data-cursor="grow">
                <AnimatedWord word="AMILCAR" />
                <br />
                <AnimatedWord word="DEV" />
              </h1>

              <div className="identity-role">
                <FiCode className="identity-code-icon" aria-hidden="true" data-blue-icon />
                <span className="identity-role-line" aria-hidden="true" />
                <p className="font-body">
                  DESARROLLADOR
                  <br />
                  FULL STACK
                </p>
              </div>
            </div>

            <div className="identity-divider" aria-hidden="true" />

            <div className="identity-details">
              <InfoRow icon={<FiMonitor aria-hidden="true" />}>
                Desarrollador full stack
              </InfoRow>
              <InfoRow icon={<FiMapPin aria-hidden="true" />}>
                Guatemala / Remoto
              </InfoRow>
              <InfoRow icon={<FiCode aria-hidden="true" />}>
                Construyo sistemas, interfaces, APIs e integraciones.
              </InfoRow>
            </div>
          </motion.div>
        </aside>

        <nav className="hero-menu" aria-label="Navegación principal">
          <motion.div
            className="hero-menu-plane"
            variants={shouldReduceMotion ? undefined : menuContainer}
            initial={shouldReduceMotion ? undefined : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
          >
            {SECTION_ITEMS.map((item) => (
              <motion.div
                key={item.label}
                className="hero-menu-item-wrapper"
                variants={shouldReduceMotion ? undefined : menuItem}
              >
                <RouteTransitionLink href={item.href} className="hero-menu-item">
                <span className="hero-menu-hover-layer">
                  <span className="hero-menu-number font-mono">
                    {item.number}
                  </span>
                  <span className="hero-menu-label font-display">
                    <span className="hero-menu-label-fill">{item.label}</span>
                    <span
                      className="hero-menu-label-outline"
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                </span>
                </RouteTransitionLink>
              </motion.div>
            ))}
          </motion.div>
        </nav>
      </div>

      <motion.nav
        className="bottom-navigation font-body"
        aria-label="Navegación secundaria"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.8, duration: 0.6 }}
      >
        {SECTION_ITEMS.map((item) => (
          <RouteTransitionLink
            key={item.label}
            href={item.href}
          >
            <span className="bottom-navigation-number font-mono">
              {item.number.slice(0, 2)}
            </span>
            <span className="bottom-navigation-label">{item.label}</span>
          </RouteTransitionLink>
        ))}
      </motion.nav>
    </motion.section>
  );
}

type AnimatedWordProps = {
  word: string;
};

function AnimatedWord({ word }: AnimatedWordProps) {
  return (
    <span className="animated-word">
      {Array.from(word).map((letter, index) => (
        <span key={`${letter}-${index}`} className="animated-letter">
          {letter}
        </span>
      ))}
    </span>
  );
}

type InfoRowProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
};

function InfoRow({ icon, children }: InfoRowProps) {
  return (
    <div className="identity-detail-row">
      <span className="identity-detail-icon" data-blue-icon>{icon}</span>
      <p className="font-body">{children}</p>
    </div>
  );
}
