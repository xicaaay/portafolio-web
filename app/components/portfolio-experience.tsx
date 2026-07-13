"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { CustomCursor } from "./custom-cursor";
import { HomeScreen } from "./home-screen";
import { LoadingScreen } from "./loading-screen";
import { ThemeSelector } from "./theme-selector";

export type ThemeMode = "light" | "dark";
type ExperiencePhase = "loading" | "theme" | "home";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("portfolio-theme");

  if (storedTheme === "light" || storedTheme === "dark") {
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
    setPhase("theme");
  }, []);

  const selectTheme = useCallback((nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    window.localStorage.setItem("portfolio-theme", nextTheme);
    setPhase("home");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      window.localStorage.setItem("portfolio-theme", nextTheme);
      return nextTheme;
    });
  }, []);

  return (
    <main className="portfolio-root">
      <AnimatePresence mode="wait" initial={false}>
        {phase === "loading" && (
          <LoadingScreen key="loading" onComplete={finishLoading} />
        )}

        {phase === "theme" && (
          <ThemeSelector
            key="theme-selector"
            currentTheme={theme}
            onSelect={selectTheme}
          />
        )}

        {phase === "home" && (
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
