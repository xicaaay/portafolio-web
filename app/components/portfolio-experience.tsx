"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { CustomCursor } from "./custom-cursor";
import { HomeScreen } from "./home-screen";
import { LoadingScreen } from "./loading-screen";

export type ThemeMode = "light" | "dark";
type ExperiencePhase = "loading" | "home";

const THEME_STORAGE_KEY = "portfolio-theme";

function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "light" || value === "dark";
}

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const documentTheme = document.documentElement.dataset.theme;

  if (isThemeMode(documentTheme)) {
    return documentTheme;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (isThemeMode(storedTheme)) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function PortfolioExperience() {
  const [phase, setPhase] = useState<ExperiencePhase>("loading");
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const finishLoading = useCallback(() => {
    setPhase("home");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      return nextTheme;
    });
  }, []);

  return (
    <main className="portfolio-root">
      <AnimatePresence mode="wait" initial={false}>
        {phase === "loading" ? (
          <LoadingScreen key="loading" onComplete={finishLoading} />
        ) : (
          <HomeScreen
            key="home"
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
      </AnimatePresence>

      {phase === "home" && <CustomCursor />}
    </main>
  );
}
