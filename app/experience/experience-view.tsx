"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { PointerEvent } from "react";
import { useMemo, useState } from "react";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiCheck,
  FiMapPin,
} from "react-icons/fi";
import { ContentState } from "../components/content-state";
import { MagneticTitle } from "../components/magnetic-title";
import { SECTION_ITEMS } from "../components/navigation-config";
import { SectionPageShell } from "../components/section-page-shell";
import { TechnologyGlyph } from "../components/technology-glyph";
import type {
  PublicApiLoadResult,
  PublicExperience,
} from "../lib/public-api";
import technologyStyles from "../technologies/technologies.module.css";

type ExperienceViewProps = {
  result: PublicApiLoadResult<PublicExperience[]>;
};

function formatPeriod(experience: PublicExperience) {
  const formatter = new Intl.DateTimeFormat("es-GT", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const start = formatter.format(new Date(experience.startDate)).replace(".", "");
  const end = experience.isCurrent
    ? "Actualidad"
    : experience.endDate
      ? formatter.format(new Date(experience.endDate)).replace(".", "")
      : "Actualidad";

  return `${start} — ${end}`;
}

function formatYear(value: string) {
  return new Intl.DateTimeFormat("es-GT", {
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

type ExperienceTechnology = PublicExperience["technologies"][number];

function MagneticExperienceTechnology({
  technology,
  index,
  reducedMotion,
}: {
  technology: ExperienceTechnology;
  index: number;
  reducedMotion: boolean;
}) {
  const [isActive, setIsActive] = useState(false);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, {
    stiffness: 118,
    damping: 11,
    mass: 0.42,
  });
  const springY = useSpring(offsetY, {
    stiffness: 118,
    damping: 11,
    mass: 0.42,
  });

  const release = () => {
    setIsActive(false);
    offsetX.set(0);
    offsetY.set(0);
  };

  const followPointer = (event: PointerEvent<HTMLSpanElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const distanceX = event.clientX - (bounds.left + bounds.width / 2);
    const distanceY = event.clientY - (bounds.top + bounds.height / 2);
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;

    setIsActive(true);
    event.currentTarget.style.setProperty("--magnetic-x", `${pointerX}%`);
    event.currentTarget.style.setProperty("--magnetic-y", `${pointerY}%`);
    offsetX.set(Math.max(-30, Math.min(30, distanceX * 0.32)));
    offsetY.set(Math.max(-18, Math.min(18, distanceY * 0.42)));
  };

  return (
    <motion.span
      className={technologyStyles.technologyItem}
      style={reducedMotion ? undefined : { x: springX, y: springY }}
      initial={reducedMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      animate={{ scale: !reducedMotion && isActive ? 1.075 : 1 }}
      viewport={{ once: true, amount: 0.65 }}
      transition={{ duration: 0.38, delay: Math.min(index * 0.04, 0.24) }}
      onPointerMove={followPointer}
      onPointerLeave={release}
      onFocus={() => setIsActive(true)}
      onBlur={release}
      tabIndex={0}
      data-cursor="action"
      data-magnetic-active={isActive ? "true" : undefined}
    >
      <TechnologyGlyph name={technology.name} iconKey={technology.iconKey} />
      <span>{technology.name}</span>
    </motion.span>
  );
}

function ExperienceDetail({ experience }: { experience: PublicExperience }) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <motion.article
      key={experience.id}
      className="soft-panel grid min-w-0 content-start gap-[clamp(2rem,4vw,4rem)] p-[clamp(1.25rem,3vw,3rem)] xl:sticky xl:top-[clamp(1.25rem,3vw,3rem)]"
      initial={{ opacity: 0, y: "1rem" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-0.7rem" }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="grid gap-3">
          <MagneticTitle as="h2" text={experience.positionTitle} className="m-0 max-w-[15ch] [overflow-wrap:anywhere] text-[clamp(1.65rem,3.2vw,3.5rem)] leading-[0.94] tracking-[-0.055em]" />
        </div>

        {experience.organizationLogoUrl ? (
          <motion.img
            src={experience.organizationLogoUrl}
            alt={`Logo de ${experience.organizationName}`}
            className="soft-icon-surface size-[clamp(3.5rem,6vw,5.5rem)] rounded-[clamp(0.75rem,1.2vw,1rem)] object-contain p-3 grayscale transition-[filter] duration-500 hover:grayscale-0"
            loading="lazy"
            decoding="async"
            animate={
              shouldReduceMotion
                ? undefined
                : { y: [0, -4, 0], rotate: [0, 1.5, 0, -1.5, 0] }
            }
            whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -5 }}
            transition={{
              duration: 5.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ) : (
          <motion.span
            className="soft-icon-surface grid size-[clamp(3.5rem,6vw,5.5rem)] place-items-center rounded-[clamp(0.75rem,1.2vw,1rem)] text-[var(--accent)]"
            data-blue-icon
            animate={
              shouldReduceMotion
                ? undefined
                : { y: [0, -4, 0], rotate: [0, 2, 0, -2, 0] }
            }
            whileHover={shouldReduceMotion ? undefined : { scale: 1.1, y: -5 }}
            transition={{
              duration: 5.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <FiBriefcase className="size-[clamp(1.3rem,2vw,2rem)]" aria-hidden="true" />
          </motion.span>
        )}
      </div>

      <div className="soft-strip grid gap-3 px-[clamp(1rem,1.8vw,1.4rem)] py-[clamp(1.1rem,2vw,1.6rem)] font-mono text-[clamp(0.62rem,0.75vw,0.82rem)] tracking-[0.05em] uppercase sm:grid-cols-2">
        <span>{experience.organizationName}</span>
        <span className="text-[var(--muted)] sm:text-right">
          {formatPeriod(experience)}
        </span>
        {experience.location && (
          <span className="inline-flex items-center gap-2 text-[var(--muted)] sm:col-span-2">
            <motion.span
              className="inline-flex text-[var(--accent)]"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [0, -2, 0], rotate: [0, -4, 4, 0] }
              }
              transition={{
                duration: 3.6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              data-blue-icon
            >
              <FiMapPin aria-hidden="true" />
            </motion.span>
            {experience.location}
          </span>
        )}
      </div>

      <div className="grid gap-4">
        <span className="section-route-marker font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.1em] uppercase">
          01 / CONTEXTO
        </span>
        <p className="m-0 whitespace-pre-line text-[clamp(0.95rem,1.15vw,1.16rem)] leading-[1.75]">
          {experience.longDescription ??
            experience.shortDescription ??
            "Experiencia profesional vinculada al desarrollo de productos y soluciones digitales."}
        </p>
      </div>

      {experience.responsibilities.length > 0 && (
        <div className="grid gap-4">
          <span className="section-route-marker font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.1em] uppercase">
            02 / RESPONSABILIDADES
          </span>
          <ul className="m-0 grid list-none gap-4 p-0">
            {experience.responsibilities.map((responsibility, index) => (
              <li
                className="grid grid-cols-[auto_1fr] items-start gap-3 text-[clamp(0.88rem,1vw,1rem)] leading-[1.65] text-[var(--muted)]"
                key={responsibility.id}
              >
                <motion.span
                  className="soft-icon-surface mt-[0.2em] grid size-[1.35rem] place-items-center rounded-full text-[var(--accent)]"
                  data-blue-icon
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.55, rotate: -20 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.18, rotate: 8 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{
                    duration: 0.48,
                    delay: shouldReduceMotion ? 0 : index * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <FiCheck className="size-[0.72rem]" aria-hidden="true" />
                </motion.span>
                <span>{responsibility.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {experience.technologies.length > 0 && (
        <div className="grid gap-4">
          <span className="section-route-marker font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.1em] uppercase">
            03 / TECNOLOGÍAS
          </span>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {experience.technologies.map((technology, index) => (
              <MagneticExperienceTechnology
                key={technology.id}
                technology={technology}
                index={index}
                reducedMotion={shouldReduceMotion}
              />
            ))}
          </div>
        </div>
      )}

      {experience.organizationUrl && (
        <a
          href={experience.organizationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/company-link inline-flex w-fit items-center gap-3 border-b border-[var(--line)] pb-2 text-foreground no-underline transition-colors duration-300 hover:border-foreground focus-visible:border-foreground"
          data-cursor="action"
        >
          Visitar organización
          <FiArrowUpRight className="transition-transform duration-300 group-hover/company-link:translate-x-[0.15rem] group-hover/company-link:translate-y-[-0.15rem]" aria-hidden="true" />
        </a>
      )}
    </motion.article>
  );
}

function ExperienceTimeline({
  experiences,
}: {
  experiences: PublicExperience[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const [activeExperienceId, setActiveExperienceId] = useState(
    experiences.at(0)?.id ?? null,
  );

  const activeExperience = useMemo(
    () =>
      experiences.find((experience) => experience.id === activeExperienceId) ??
      experiences.at(0) ??
      null,
    [activeExperienceId, experiences],
  );

  return (
    <>
      <div className="soft-strip mb-[clamp(1.5rem,3vw,3rem)] flex flex-wrap items-center justify-between gap-5 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(1rem,2vw,1.5rem)] font-mono text-[clamp(0.6rem,0.72vw,0.78rem)] tracking-[0.09em] text-[var(--muted)] uppercase">
        <span>{experiences.length} etapas profesionales</span>
        <span>Selecciona una para ampliar</span>
      </div>

      <section className="grid min-w-0 gap-[clamp(1.25rem,3vw,3rem)] xl:grid-cols-[minmax(18rem,0.74fr)_minmax(0,1.26fr)] xl:items-start" aria-label="Línea de tiempo profesional">
        <div className="relative grid min-w-0">
          <span className="absolute top-0 bottom-0 left-[clamp(1.05rem,2vw,1.5rem)] w-[0.0625rem] bg-[var(--line)]" aria-hidden="true" />

          {experiences.map((experience, index) => {
            const isActive = experience.id === activeExperience?.id;

            return (
              <motion.button
                type="button"
                key={experience.id}
                className={`group/timeline relative grid cursor-pointer grid-cols-[clamp(2.1rem,4vw,3rem)_minmax(0,1fr)] gap-[clamp(1rem,2vw,1.5rem)] border-b border-[var(--line)] bg-transparent py-[clamp(1.35rem,2.6vw,2.4rem)] pr-[clamp(0.5rem,1vw,1rem)] text-left transition-colors duration-300 first:border-t ${
                  isActive
                    ? "text-foreground"
                    : "text-[var(--muted)] hover:text-foreground focus-visible:text-foreground"
                }`}
                onMouseEnter={() => setActiveExperienceId(experience.id)}
                onFocus={() => setActiveExperienceId(experience.id)}
                onClick={() => setActiveExperienceId(experience.id)}
                initial={shouldReduceMotion ? false : { opacity: 0, x: "-1rem" }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.48, delay: index * 0.06 }}
                data-cursor="action"
              >
                <span className="relative z-10 grid size-[clamp(2.1rem,4vw,3rem)] place-items-center">
                  <motion.span
                    className={`block size-[clamp(0.65rem,1vw,0.9rem)] rounded-full border transition duration-300 ${
                      isActive
                        ? "border-[var(--accent)] bg-[var(--accent)] shadow-[0_0_0_0.4rem_color-mix(in_srgb,var(--accent)_14%,transparent)]"
                        : "border-[var(--muted)] bg-background group-hover/timeline:border-[var(--accent)] group-focus-visible/timeline:border-[var(--accent)]"
                    }`}
                    animate={
                      isActive && !shouldReduceMotion
                        ? { scale: [1.12, 1.32, 1.12] }
                        : { scale: 1 }
                    }
                    transition={{
                      duration: 2.2,
                      repeat:
                        isActive && !shouldReduceMotion
                          ? Number.POSITIVE_INFINITY
                          : 0,
                      ease: "easeInOut",
                    }}
                    data-blue-icon
                  />
                </span>

                <span className="grid min-w-0 gap-3">
                  <span className="flex flex-wrap items-center justify-between gap-3 font-mono text-[clamp(0.56rem,0.66vw,0.72rem)] tracking-[0.08em] uppercase">
                    <span>{formatYear(experience.startDate)}</span>
                    {experience.isCurrent && (
                      <span className="text-[var(--accent)]">ACTUAL</span>
                    )}
                  </span>

                  <strong className="text-[clamp(1.2rem,2vw,2rem)] leading-[1.05] font-medium tracking-[-0.035em]">
                    {experience.positionTitle}
                  </strong>

                  <span className="text-[clamp(0.82rem,0.95vw,0.96rem)] leading-[1.5]">
                    {experience.organizationName}
                  </span>

                  {experience.shortDescription && (
                    <span className="line-clamp-2 text-[clamp(0.78rem,0.9vw,0.9rem)] leading-[1.6] opacity-75">
                      {experience.shortDescription}
                    </span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {activeExperience && (
              <ExperienceDetail experience={activeExperience} />
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

export function ExperienceView({ result }: ExperienceViewProps) {
  return (
    <SectionPageShell
      section={SECTION_ITEMS[3]}
      eyebrow="RECORRIDO PROFESIONAL"
      intro="Una línea de tiempo centrada en responsabilidades, decisiones técnicas y aprendizajes. La información se mantiene breve en el recorrido y se amplía únicamente al seleccionar una etapa."
    >
      {result.status === "success" && (
        <ExperienceTimeline experiences={result.data} />
      )}

      {result.status === "empty" && (
        <ContentState
          type="empty"
          title="Aún no hay experiencia pública."
          message="Las experiencias activas del administrador se integrarán automáticamente en esta línea de tiempo."
        />
      )}

      {result.status === "error" && (
        <ContentState
          type="error"
          title="No pudimos cargar la experiencia."
          message={result.message}
        />
      )}
    </SectionPageShell>
  );
}
