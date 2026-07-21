"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CustomCursor } from "./custom-cursor";
import { ThemeToggle } from "./theme-toggle";

export type ThemeMode = "light" | "dark";

type PortfolioContextValue = {
  theme: ThemeMode;
  isTransitioning: boolean;
  targetPath: string | null;
  navigate: (href: string) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "portfolio-theme";
const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [isThemeReady, setIsThemeReady] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [isCoverVisible, setIsCoverVisible] = useState(false);
  const coverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTransitioning = targetPath !== null;

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const documentTheme = document.documentElement.dataset.theme;
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      const systemTheme: ThemeMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches
        ? "dark"
        : "light";

      const initialTheme = isThemeMode(documentTheme)
        ? documentTheme
        : isThemeMode(storedTheme)
          ? storedTheme
          : systemTheme;

      setTheme(initialTheme);
      setIsThemeReady(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!isThemeReady) return;

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [isThemeReady, theme]);

  useEffect(() => {
    if (!targetPath || pathname !== targetPath) return;

    coverTimeoutRef.current = setTimeout(() => setIsCoverVisible(false), 0);
    finishTimeoutRef.current = setTimeout(
      () => setTargetPath(null),
      shouldReduceMotion ? 120 : 520,
    );
  }, [pathname, shouldReduceMotion, targetPath]);

  useEffect(
    () => () => {
      if (coverTimeoutRef.current) clearTimeout(coverTimeoutRef.current);
      if (routeTimeoutRef.current) clearTimeout(routeTimeoutRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    },
    [],
  );

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      return nextTheme;
    });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (isTransitioning || href === pathname) return;

      if (coverTimeoutRef.current) clearTimeout(coverTimeoutRef.current);
      if (routeTimeoutRef.current) clearTimeout(routeTimeoutRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);

      setTargetPath(href);
      setIsCoverVisible(false);

      const coverDelay = shouldReduceMotion ? 40 : 620;
      const routeDelay = shouldReduceMotion ? 180 : 1120;

      coverTimeoutRef.current = setTimeout(
        () => setIsCoverVisible(true),
        coverDelay,
      );
      routeTimeoutRef.current = setTimeout(() => router.push(href), routeDelay);
    },
    [isTransitioning, pathname, router, shouldReduceMotion],
  );

  const value = useMemo(
    () => ({
      theme,
      isTransitioning,
      targetPath,
      navigate,
      toggleTheme,
    }),
    [isTransitioning, navigate, targetPath, theme, toggleTheme],
  );

  return (
    <PortfolioContext.Provider value={value}>
      <div className="portfolio-shell" aria-busy={isTransitioning}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            className="route-page"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.12 : 0.52,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        <ThemeToggle />
        <CustomCursor />

        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="route-transition"
              aria-hidden="true"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.08 : 0.35 }}
            >
              <motion.div
                className="route-transition-cover"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={
                  isCoverVisible
                    ? { opacity: 1, scaleY: 1 }
                    : { opacity: 0, scaleY: 0 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0.12 : 0.48,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                <span className="route-transition-mark font-display">AX</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error("usePortfolio debe utilizarse dentro de PortfolioShell.");
  }

  return context;
}
