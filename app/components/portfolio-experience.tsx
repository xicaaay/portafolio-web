"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useState } from "react";
import { HomeScreen } from "./home-screen";
import { LoadingScreen } from "./loading-screen";

type ExperiencePhase = "loading" | "home";

type PortfolioExperienceProps = {
  profileImageUrl: string | null;
  publicName: string;
};

export function PortfolioExperience({
  profileImageUrl,
  publicName,
}: PortfolioExperienceProps) {
  const [phase, setPhase] = useState<ExperiencePhase>("loading");
  const finishLoading = useCallback(() => setPhase("home"), []);

  return (
    <main className="portfolio-root">
      <AnimatePresence mode="wait" initial={false}>
        {phase === "loading" ? (
          <LoadingScreen key="loading" onComplete={finishLoading} />
        ) : (
          <HomeScreen
            key="home"
            profileImageUrl={profileImageUrl}
            publicName={publicName}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
