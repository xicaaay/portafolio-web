"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiMousePointer, FiRadio } from "react-icons/fi";
import { ContentState } from "../components/content-state";
import { SECTION_ITEMS } from "../components/navigation-config";
import { SectionPageShell } from "../components/section-page-shell";
import { TechnologyGlyph } from "../components/technology-glyph";
import type {
  PublicApiLoadResult,
  PublicTechnology,
} from "../lib/public-api";

type TechnologiesViewProps = {
  result: PublicApiLoadResult<PublicTechnology[]>;
};

type TechnologyOffset = {
  x: string;
  y: string;
  rotate: number;
};

type RippleState = {
  id: number;
  x: number;
  y: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  LANGUAGE: "Lenguajes",
  FRAMEWORK: "Frameworks",
  LIBRARY: "Librerías",
  DATABASE: "Bases de datos",
  TOOL: "Herramientas",
  PLATFORM: "Plataformas",
  SERVICE: "Servicios",
  CLOUD: "Cloud",
  AUTOMATION: "Automatización",
  AI: "Inteligencia artificial",
  OTHER: "Otros",
};

function getCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category.replaceAll("_", " ");
}

function TechnologiesCollage({
  technologies,
}: {
  technologies: PublicTechnology[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rippleIdRef = useRef(0);
  const [activeTechnologyId, setActiveTechnologyId] = useState(
    technologies.at(0)?.id ?? null,
  );
  const [offsets, setOffsets] = useState<Record<string, TechnologyOffset>>({});
  const [ripple, setRipple] = useState<RippleState | null>(null);

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const activeTechnology =
    technologies.find((technology) => technology.id === activeTechnologyId) ??
    technologies.at(0) ??
    null;

  const categories = useMemo(() => {
    const values = new Map<string, number>();

    technologies.forEach((technology) => {
      values.set(technology.category, (values.get(technology.category) ?? 0) + 1);
    });

    return Array.from(values.entries());
  }, [technologies]);

  const triggerWave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const clickX = event.clientX - containerRect.left;
    const clickY = event.clientY - containerRect.top;
    const maxDistance = Math.hypot(containerRect.width, containerRect.height);
    const nextOffsets: Record<string, TechnologyOffset> = {};

    itemRefs.current.forEach((element, technologyId) => {
      const itemRect = element.getBoundingClientRect();
      const centerX = itemRect.left - containerRect.left + itemRect.width / 2;
      const centerY = itemRect.top - containerRect.top + itemRect.height / 2;
      const deltaX = centerX - clickX;
      const deltaY = centerY - clickY;
      const distance = Math.max(Math.hypot(deltaX, deltaY), 1);
      const proximity = Math.max(0.18, 1 - distance / maxDistance);
      const magnitudeRem = 0.45 + proximity * 1.45;

      nextOffsets[technologyId] = {
        x: `${((deltaX / distance) * magnitudeRem).toFixed(3)}rem`,
        y: `${((deltaY / distance) * magnitudeRem).toFixed(3)}rem`,
        rotate: (deltaX / Math.max(containerRect.width, 1)) * 10,
      };
    });

    setOffsets(nextOffsets);
    rippleIdRef.current += 1;
    setRipple({
      id: rippleIdRef.current,
      x: (clickX / containerRect.width) * 100,
      y: (clickY / containerRect.height) * 100,
    });

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setOffsets({}), 170);
  };

  return (
    <>
      <div className="mb-[clamp(1.5rem,3vw,3rem)] flex flex-wrap items-center justify-between gap-5 border-y border-[var(--line)] py-[clamp(1rem,2vw,1.5rem)]">
        <div className="flex flex-wrap gap-x-[clamp(1rem,2vw,2rem)] gap-y-3 font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.08em] text-[var(--muted)] uppercase">
          {categories.map(([category, count]) => (
            <span key={category}>
              {getCategoryLabel(category)} / {String(count).padStart(2, "0")}
            </span>
          ))}
        </div>

        <span className="inline-flex items-center gap-3 font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.08em] text-[var(--muted)] uppercase">
          <FiMousePointer
            className="text-[var(--accent)] transition-transform duration-300 hover:scale-125"
            aria-hidden="true"
            data-blue-icon
          />
          Haz clic para generar una onda
        </span>
      </div>

      <section
        ref={containerRef}
        className="relative isolate overflow-hidden border border-[var(--line)] bg-[var(--surface)] p-[clamp(1rem,3vw,3rem)]"
        aria-label="Collage interactivo de tecnologías"
        onPointerDown={triggerWave}
      >
        <AnimatePresence>
          {ripple && (
            <motion.span
              key={ripple.id}
              className="pointer-events-none absolute z-0 aspect-square w-[clamp(7rem,18vw,16rem)] rounded-full border border-[var(--accent)]"
              style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
              initial={{ x: "-50%", y: "-50%", scale: 0.08, opacity: 0.85 }}
              animate={{ scale: 5.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 grid grid-cols-2 gap-[clamp(0.65rem,1.3vw,1.1rem)] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {technologies.map((technology, index) => {
            const offset = offsets[technology.id] ?? {
              x: "0rem",
              y: "0rem",
              rotate: 0,
            };
            const isActive = technology.id === activeTechnology?.id;

            return (
              <motion.button
                ref={(element) => {
                  if (element) itemRefs.current.set(technology.id, element);
                  else itemRefs.current.delete(technology.id);
                }}
                type="button"
                className={`group/tech relative grid min-h-[clamp(8.5rem,14vw,12rem)] cursor-pointer content-between overflow-hidden border p-[clamp(0.9rem,1.7vw,1.4rem)] text-left transition-colors duration-300 ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-[var(--line)] bg-background text-foreground hover:border-foreground focus-visible:border-foreground"
                }`}
                key={technology.id}
                animate={{ x: offset.x, y: offset.y, rotate: offset.rotate }}
                transition={{ type: "spring", stiffness: 190, damping: 14, mass: 0.72 }}
                onPointerEnter={() => setActiveTechnologyId(technology.id)}
                onFocus={() => setActiveTechnologyId(technology.id)}
                onClick={() => setActiveTechnologyId(technology.id)}
                data-cursor="action"
              >
                <span className="flex items-start justify-between gap-4">
                  <span
                    className={`grid size-[clamp(2.4rem,4vw,3.4rem)] place-items-center rounded-full border transition duration-300 group-hover/tech:scale-115 group-focus-visible/tech:scale-115 ${
                      isActive
                        ? "border-[color-mix(in_srgb,var(--background)_24%,transparent)] text-background"
                        : "border-[var(--line)] text-[var(--accent)]"
                    }`}
                    data-blue-icon={!isActive ? true : undefined}
                  >
                    <TechnologyGlyph
                      name={technology.name}
                      iconKey={technology.iconKey}
                      className="size-[clamp(1rem,1.8vw,1.45rem)]"
                    />
                  </span>

                  <span
                    className={`font-mono text-[clamp(0.54rem,0.62vw,0.68rem)] tracking-[0.08em] uppercase ${
                      isActive
                        ? "text-[color-mix(in_srgb,var(--background)_68%,transparent)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>

                <span className="grid gap-2">
                  <strong className="text-[clamp(0.95rem,1.2vw,1.2rem)] leading-tight font-medium">
                    {technology.name}
                  </strong>
                  <span
                    className={`font-mono text-[clamp(0.52rem,0.6vw,0.66rem)] tracking-[0.07em] uppercase ${
                      isActive
                        ? "text-[color-mix(in_srgb,var(--background)_68%,transparent)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {getCategoryLabel(technology.category)}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="relative z-10 mt-[clamp(1rem,2vw,1.5rem)] grid min-h-[clamp(8rem,16vw,12rem)] content-between gap-6 border border-[var(--line)] bg-background p-[clamp(1.25rem,2.5vw,2.25rem)] md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
          <AnimatePresence mode="wait">
            {activeTechnology && (
              <motion.div
                key={activeTechnology.id}
                className="contents"
                initial={{ opacity: 0, y: "0.6rem" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-0.4rem" }}
                transition={{ duration: 0.28 }}
              >
                <span
                  className="grid size-[clamp(3.5rem,7vw,6rem)] place-items-center rounded-full border border-[var(--line)] text-[var(--accent)] transition-transform duration-300 hover:scale-110"
                  data-blue-icon
                >
                  <TechnologyGlyph
                    name={activeTechnology.name}
                    iconKey={activeTechnology.iconKey}
                    className="size-[clamp(1.5rem,3vw,2.5rem)]"
                  />
                </span>

                <div className="grid gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="m-0 text-[clamp(1.5rem,3vw,3rem)] leading-none tracking-[-0.045em]">
                      {activeTechnology.name}
                    </h2>
                    <span className="font-mono text-[clamp(0.56rem,0.66vw,0.72rem)] tracking-[0.08em] text-[var(--muted)] uppercase">
                      {getCategoryLabel(activeTechnology.category)}
                    </span>
                  </div>

                  <p className="m-0 max-w-[58rem] text-[clamp(0.9rem,1.1vw,1.08rem)] leading-[1.7] text-[var(--muted)]">
                    {activeTechnology.description ??
                      "Tecnología activa dentro del stack público del portafolio."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span className="pointer-events-none absolute right-[clamp(1rem,2vw,2rem)] bottom-[clamp(1rem,2vw,2rem)] z-20 hidden items-center gap-2 font-mono text-[clamp(0.52rem,0.6vw,0.66rem)] tracking-[0.08em] text-[var(--muted)] uppercase xl:inline-flex">
          <FiRadio className="text-[var(--accent)]" aria-hidden="true" data-blue-icon />
          INTERACCIÓN ACTIVA
        </span>
      </section>
    </>
  );
}

export function TechnologiesView({ result }: TechnologiesViewProps) {
  return (
    <SectionPageShell
      section={SECTION_ITEMS[2]}
      eyebrow="STACK TÉCNICO"
      intro="Lenguajes, frameworks, servicios y herramientas que utilizo para convertir necesidades de producto en soluciones mantenibles. El collage responde al cursor y cada clic genera una onda que reorganiza temporalmente el sistema."
    >
      {result.status === "success" && (
        <TechnologiesCollage technologies={result.data} />
      )}

      {result.status === "empty" && (
        <ContentState
          type="empty"
          title="Aún no hay tecnologías visibles."
          message="Las tecnologías activas y marcadas para el portafolio aparecerán aquí automáticamente."
        />
      )}

      {result.status === "error" && (
        <ContentState
          type="error"
          title="No pudimos cargar el stack técnico."
          message={result.message}
        />
      )}
    </SectionPageShell>
  );
}
