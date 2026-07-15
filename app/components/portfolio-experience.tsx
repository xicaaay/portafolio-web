"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useState } from "react";
import { HomeScreen } from "./home-screen";
import { LoadingScreen } from "./loading-screen";

type ExperiencePhase = "loading" | "home";

export function PortfolioExperience() {
  const [phase, setPhase] = useState<ExperiencePhase>("loading");
  const finishLoading = useCallback(() => setPhase("home"), []);

  return (
    <main className="portfolio-root">
      <AnimatePresence mode="wait" initial={false}>
        {phase === "loading" ? (
          <LoadingScreen key="loading" onComplete={finishLoading} />
        ) : (
          <HomeScreen key="home" />
        )}
      </AnimatePresence>
    </main>
  );
}
