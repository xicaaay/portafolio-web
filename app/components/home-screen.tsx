"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  id: string;
  number: string;
  label: string;
};

const MENU_ITEMS: MenuItem[] = [
  { id: "about", number: "01/", label: "Sobre mí" },
  { id: "projects", number: "02/", label: "Proyectos" },
  { id: "technologies", number: "03/", label: "Tecnologías" },
  { id: "experience", number: "04/", label: "Experiencia" },
  { id: "contact", number: "05/", label: "Contacto" },
];

const NAVIGATION_EASE = [0.22, 1, 0.36, 1] as const;

const menuContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.24,
    },
  },
  section: {
    transition: {
      staggerChildren: 0.045,
      staggerDirection: -1,
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
      ease: NAVIGATION_EASE,
    },
  },
  section: {
    opacity: 0,
    x: 72,
    filter: "blur(12px)",
    transition: {
      duration: 0.46,
      ease: NAVIGATION_EASE,
    },
  },
};

const navigationCue = {
  hidden: {
    opacity: 0,
    y: -16,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.38,
      duration: 0.65,
      ease: NAVIGATION_EASE,
    },
  },
  section: {
    opacity: 0,
    x: -28,
    filter: "blur(9px)",
    transition: {
      duration: 0.38,
      ease: NAVIGATION_EASE,
    },
  },
};

const identityBlock = {
  hidden: {
    opacity: 0,
    x: -52,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.46,
      duration: 0.78,
      ease: NAVIGATION_EASE,
    },
  },
  section: {
    opacity: 0,
    x: -46,
    filter: "blur(11px)",
    transition: {
      delay: 0.06,
      duration: 0.46,
      ease: NAVIGATION_EASE,
    },
  },
};

const bottomNavigation = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(7px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.8,
      duration: 0.6,
      ease: NAVIGATION_EASE,
    },
  },
  section: {
    opacity: 0,
    y: 22,
    filter: "blur(9px)",
    transition: {
      delay: 0.1,
      duration: 0.4,
      ease: NAVIGATION_EASE,
    },
  },
};


const reducedMenuContainer = {
  hidden: {},
  visible: { transition: { duration: 0.01 } },
  section: { transition: { duration: 0.01 } },
};

const reducedMenuItem = {
  hidden: { opacity: 1, x: 0, filter: "blur(0px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.01 },
  },
  section: {
    opacity: 0,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.01 },
  },
};

const reducedHomeElement = {
  hidden: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.01 },
  },
  section: {
    opacity: 0,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.01 },
  },
};

export function HomeScreen({ theme, onToggleTheme }: HomeScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const activeTitleRef = useRef<HTMLButtonElement>(null);
  const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const focusActiveTitleRef = useRef(false);
  const focusMenuItemRef = useRef<string | null>(null);

  const motionState = activeItem ? "section" : "visible";
  const sharedTitleTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { duration: 0.82, ease: [0.76, 0, 0.24, 1] as const };

  const openSection = useCallback(
    (item: MenuItem, triggeredWithKeyboard: boolean) => {
      focusActiveTitleRef.current = triggeredWithKeyboard;
      focusMenuItemRef.current = null;
      setActiveItem(item);
    },
    [],
  );

  const returnToMenu = useCallback(
    (triggeredWithKeyboard: boolean) => {
      if (!activeItem) {
        return;
      }

      focusMenuItemRef.current = triggeredWithKeyboard ? activeItem.id : null;
      focusActiveTitleRef.current = false;
      setActiveItem(null);
    },
    [activeItem],
  );

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

  useEffect(() => {
    if (!activeItem || !focusActiveTitleRef.current) {
      return;
    }

    const focusTimer = window.setTimeout(
      () => {
        activeTitleRef.current?.focus({ preventScroll: true });
        focusActiveTitleRef.current = false;
      },
      shouldReduceMotion ? 0 : 820,
    );

    return () => window.clearTimeout(focusTimer);
  }, [activeItem, shouldReduceMotion]);

  useEffect(() => {
    if (activeItem || !focusMenuItemRef.current) {
      return;
    }

    const itemId = focusMenuItemRef.current;
    const focusTimer = window.setTimeout(
      () => {
        menuButtonRefs.current[itemId]?.focus({ preventScroll: true });
        focusMenuItemRef.current = null;
      },
      shouldReduceMotion ? 0 : 820,
    );

    return () => window.clearTimeout(focusTimer);
  }, [activeItem, shouldReduceMotion]);

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      returnToMenu(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem, returnToMenu]);

  return (
    <LayoutGroup id="portfolio-section-navigation">
      <motion.section
        ref={sectionRef}
        id="inicio"
        className={`portfolio-home ${activeItem ? "has-active-section" : ""}`}
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0.15 : 0.85,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        <header className="home-topbar">
          <AnimatePresence initial={false}>
            {!activeItem && (
              <motion.div
                key="interactive-label"
                className="interactive-label font-mono"
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, filter: "blur(7px)" }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.2,
                  duration: shouldReduceMotion ? 0.01 : 0.55,
                  ease: NAVIGATION_EASE,
                }}
              >
                <span aria-hidden="true" />
                MENÚ INTERACTIVO
              </motion.div>
            )}
          </AnimatePresence>

          <div className="home-topbar-actions">
            <motion.button
              type="button"
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label={
                theme === "light"
                  ? "Cambiar a modo oscuro"
                  : "Cambiar a modo claro"
              }
              title={theme === "light" ? "Modo oscuro" : "Modo claro"}
              data-cursor="action"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.28,
                duration: 0.55,
              }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === "light" ? (
                <FiMoon aria-hidden="true" />
              ) : (
                <FiSun aria-hidden="true" />
              )}
            </motion.button>

            <AnimatePresence initial={false}>
              {activeItem && (
                <motion.button
                  ref={activeTitleRef}
                  key={activeItem.id}
                  type="button"
                  className="active-section-title"
                  onClick={(event) => returnToMenu(event.detail === 0)}
                  aria-label={`${activeItem.label}. Volver al menú principal`}
                  title="Volver al menú principal"
                  data-cursor="action"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
                >
                  <motion.span
                    layoutId={`section-title-${activeItem.id}`}
                    className="hero-menu-hover-layer active-section-title-visual"
                    transition={sharedTitleTransition}
                  >
                    <MenuTitleContent
                      item={activeItem}
                      labelId={`active-section-title-${activeItem.id}`}
                    />
                  </motion.span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div
          className="home-content"
          inert={activeItem ? true : undefined}
        >
          <aside className="home-sidebar">
            <motion.div
              className="navigation-cue"
              variants={shouldReduceMotion ? reducedHomeElement : navigationCue}
              initial={shouldReduceMotion ? "visible" : "hidden"}
              animate={motionState}
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
                animate={
                  shouldReduceMotion || activeItem ? undefined : { y: [0, 8, 0] }
                }
                transition={{
                  duration: 1.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FiArrowDown aria-hidden="true" />
              </motion.span>
            </motion.div>

            <motion.div
              className="identity-block"
              variants={shouldReduceMotion ? reducedHomeElement : identityBlock}
              initial={shouldReduceMotion ? "visible" : "hidden"}
              animate={motionState}
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
              variants={shouldReduceMotion ? reducedMenuContainer : menuContainer}
              initial={shouldReduceMotion ? "visible" : "hidden"}
              animate={motionState}
            >
              {MENU_ITEMS.map((item) => {
                const isActive = activeItem?.id === item.id;

                return (
                  <motion.button
                    ref={(element) => {
                      menuButtonRefs.current[item.id] = element;
                    }}
                    key={item.id}
                    type="button"
                    className={`hero-menu-item ${isActive ? "is-active" : ""}`}
                    variants={shouldReduceMotion ? reducedMenuItem : menuItem}
                    onClick={(event) => openSection(item, event.detail === 0)}
                    data-cursor="action"
                    aria-current={isActive ? "page" : undefined}
                    disabled={Boolean(activeItem)}
                  >
                    <AnimatePresence initial={false}>
                      {!isActive && (
                        <motion.span
                          key={`menu-title-${item.id}`}
                          layoutId={`section-title-${item.id}`}
                          className="hero-menu-hover-layer"
                          transition={sharedTitleTransition}
                        >
                          <MenuTitleContent item={item} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </motion.div>
          </nav>
        </div>

        <AnimatePresence initial={false}>
          {activeItem && (
            <motion.section
              key={`section-stage-${activeItem.id}`}
              className="active-section-stage"
              aria-labelledby={`active-section-title-${activeItem.id}`}
              data-section={activeItem.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.52,
                duration: shouldReduceMotion ? 0.01 : 0.35,
              }}
            />
          )}
        </AnimatePresence>

        <motion.nav
          className="bottom-navigation font-body"
          aria-label="Navegación secundaria"
          inert={activeItem ? true : undefined}
          variants={
            shouldReduceMotion ? reducedHomeElement : bottomNavigation
          }
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate={motionState}
        >
          {MENU_ITEMS.map((item) => {
            const isActive = activeItem?.id === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={isActive ? "is-active" : ""}
                onClick={(event) => openSection(item, event.detail === 0)}
                data-cursor="action"
                aria-current={isActive ? "page" : undefined}
                disabled={Boolean(activeItem)}
              >
                <span className="bottom-navigation-number font-mono">
                  {item.number.slice(0, 2)}
                </span>
                <span className="bottom-navigation-label">{item.label}</span>
              </button>
            );
          })}
        </motion.nav>
      </motion.section>
    </LayoutGroup>
  );
}

type MenuTitleContentProps = {
  item: MenuItem;
  labelId?: string;
};

function MenuTitleContent({ item, labelId }: MenuTitleContentProps) {
  return (
    <>
      <span className="hero-menu-number font-mono">{item.number}</span>
      <span className="hero-menu-label font-display">
        <span id={labelId} className="hero-menu-label-fill">
          {item.label}
        </span>
        <span className="hero-menu-label-outline" aria-hidden="true">
          {item.label}
        </span>
      </span>
    </>
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
