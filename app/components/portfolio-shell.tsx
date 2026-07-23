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
import { DotCharacterLoader } from "./dot-character-loader";
import { ScrollControls } from "./scroll-controls";
import { SiteHeader } from "./site-header";
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoaderReady, setIsLoaderReady] = useState(false);
  const initialReadyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialFinishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = shouldReduceMotion ?? false;
  const isTransitioning = isInitialLoading || targetPath !== null;
  const isProjectDetail = /^\/projects\/[^/]+\/?$/.test(pathname);

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
    initialReadyTimeoutRef.current = setTimeout(
      () => setIsLoaderReady(true),
      reducedMotion ? 60 : 460,
    );
    initialFinishTimeoutRef.current = setTimeout(
      () => setIsInitialLoading(false),
      reducedMotion ? 220 : 2240,
    );

    return () => {
      if (initialReadyTimeoutRef.current) clearTimeout(initialReadyTimeoutRef.current);
      if (initialFinishTimeoutRef.current) clearTimeout(initialFinishTimeoutRef.current);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!targetPath || pathname !== targetPath) return;

    const readyTimeout = setTimeout(() => setIsLoaderReady(true), 0);
    finishTimeoutRef.current = setTimeout(
      () => {
        setTargetPath(null);
        setIsLoaderReady(false);
      },
      reducedMotion ? 220 : 2050,
    );

    return () => clearTimeout(readyTimeout);
  }, [pathname, reducedMotion, targetPath]);

  useEffect(
    () => () => {
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

      if (routeTimeoutRef.current) clearTimeout(routeTimeoutRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);

      setTargetPath(href);
      setIsLoaderReady(false);

      const routeDelay = reducedMotion ? 80 : 320;
      routeTimeoutRef.current = setTimeout(() => router.push(href), routeDelay);
    },
    [isTransitioning, pathname, reducedMotion, router],
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
        <SiteHeader onNavigate={navigate} />
        <div key={pathname} className="route-page">
          {children}
        </div>

        <ScrollControls hidden={isTransitioning} />
        {isProjectDetail && <ThemeToggle placement="detail" />}
        <CustomCursor />

        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="route-transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.08 : 0.28 }}
            >
              <DotCharacterLoader
                ready={isLoaderReady}
                label={targetPath ? "Cargando proyecto" : "Preparando sitio"}
                overlay
              />
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
