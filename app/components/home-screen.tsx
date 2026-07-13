"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  FiArrowDown,
  FiCode,
  FiMapPin,
  FiMonitor,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import type { ThemeMode } from "./portfolio-experience";

type HomeScreenProps = {
  theme: ThemeMode;
  onToggleTheme: () => void;
};

type MenuItem = {
  number: string;
  label: string;
};

const MENU_ITEMS: MenuItem[] = [
  { number: "01/", label: "Inicio" },
  { number: "02/", label: "Proyectos" },
  { number: "03/", label: "Tecnologías" },
  { number: "04/", label: "Experiencia" },
  { number: "05/", label: "Contacto" },
];

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

export function HomeScreen({ theme, onToggleTheme }: HomeScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeItem, setActiveItem] = useState("Inicio");

  return (
    <motion.section
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
      <header className="home-topbar">
        <motion.div
          className="interactive-label font-mono"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: 0.55 }}
        >
          <span aria-hidden="true" />
          MENÚ INTERACTIVO
        </motion.div>

        <motion.button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={
            theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"
          }
          title={theme === "light" ? "Modo oscuro" : "Modo claro"}
          data-cursor="action"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.28, duration: 0.55 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === "light" ? (
            <FiMoon aria-hidden="true" />
          ) : (
            <FiSun aria-hidden="true" />
          )}
        </motion.button>
      </header>

      <div className="home-content">
        <aside className="home-sidebar">
          <motion.div
            className="navigation-cue"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.38, duration: 0.65 }}
          >
            <span className="navigation-cue-line" aria-hidden="true" />
            <p className="font-body">
              DESPLAZA
              <br />
              PARA
              <br />
              NAVEGAR
            </p>
            <motion.span
              className="navigation-cue-arrow"
              animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
            >
              <FiArrowDown aria-hidden="true" />
            </motion.span>
          </motion.div>

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
                <FiCode className="identity-code-icon" aria-hidden="true" />
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
            {MENU_ITEMS.map((item) => (
              <motion.button
                key={item.label}
                type="button"
                className={`hero-menu-item ${
                  activeItem === item.label ? "is-active" : ""
                }`}
                variants={shouldReduceMotion ? undefined : menuItem}
                onClick={() => setActiveItem(item.label)}
                data-cursor="action"
                aria-current={activeItem === item.label ? "page" : undefined}
              >
                <span className="hero-menu-number font-mono">{item.number}</span>
                <span className="hero-menu-label font-display">
                  <span className="hero-menu-label-fill">{item.label}</span>
                  <span className="hero-menu-label-outline" aria-hidden="true">
                    {item.label}
                  </span>
                </span>
              </motion.button>
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
        {MENU_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className={activeItem === item.label ? "is-active" : ""}
            onClick={() => setActiveItem(item.label)}
            data-cursor="action"
            aria-current={activeItem === item.label ? "page" : undefined}
          >
            <span className="bottom-navigation-number font-mono">
              {item.number.slice(0, 2)}
            </span>
            <span className="bottom-navigation-label">{item.label}</span>
          </button>
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
      <span className="identity-detail-icon">{icon}</span>
      <p className="font-body">{children}</p>
    </div>
  );
}
