"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { InteractiveSectionTitle } from "./interactive-section-title";
import type { SectionItem } from "./navigation-config";
import { PortfolioLogo } from "./portfolio-logo";
import { RouteTransitionLink } from "./route-transition-link";
import { SectionNavigation } from "./section-navigation";

type SectionPageShellProps = {
  section: SectionItem;
  eyebrow: string;
  intro: string;
  children: ReactNode;
};

export function SectionPageShell({
  section,
  eyebrow,
  intro,
  children,
}: SectionPageShellProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="section-page-shell grid min-h-svh min-w-0 grid-rows-[auto_auto_1fr_auto] overflow-x-clip bg-background p-[clamp(1rem,3vw,3rem)] text-foreground">
      <header className="internal-header">
        <RouteTransitionLink href="/" className="internal-brand" aria-label="Ir al inicio">
          <PortfolioLogo />
        </RouteTransitionLink>
        <span className="internal-header-meta font-mono">PORTFOLIO</span>
      </header>

      <motion.section
        className="section-page-hero grid min-w-0 w-full gap-[clamp(1.25rem,3vw,3rem)] py-[clamp(3.25rem,9vh,8rem)]"
        aria-labelledby="section-page-title"
        initial={
          shouldReduceMotion ? false : { opacity: 0, y: "clamp(1rem,3vw,2.5rem)" }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="section-page-meta flex min-w-0 flex-wrap items-center justify-between gap-4 font-mono text-[clamp(0.62rem,0.72vw,0.78rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
          <span>
            {section.number} {eyebrow}
          </span>
          <span>DESPLAZA PARA EXPLORAR</span>
        </div>

        <InteractiveSectionTitle id="section-page-title" text={section.label} />

        <p className="section-page-intro m-0 max-w-[56rem] [overflow-wrap:anywhere] text-[clamp(0.95rem,1.35vw,1.35rem)] leading-[1.7] text-[var(--muted)]">
          {intro}
        </p>
      </motion.section>

      <div className="section-page-content min-w-0 w-full pb-[clamp(3.5rem,8vw,8rem)]">{children}</div>

      <SectionNavigation />
    </main>
  );
}
