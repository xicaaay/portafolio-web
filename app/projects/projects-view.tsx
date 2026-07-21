"use client";

/* eslint-disable @next/next/no-img-element */

import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiArrowUpRight,
  FiExternalLink,
  FiGithub,
  FiImage,
  FiLayers,
  FiX,
} from "react-icons/fi";
import { ContentState } from "../components/content-state";
import { SECTION_ITEMS } from "../components/navigation-config";
import { SectionPageShell } from "../components/section-page-shell";
import { TechnologyGlyph } from "../components/technology-glyph";
import { ProjectDetailLoader } from "./project-detail-loader";
import type {
  PublicProject,
  PublicProjectsLoadResult,
} from "../lib/public-api";

type ProjectsViewProps = {
  result: PublicProjectsLoadResult;
};

type ProjectModalProps = {
  project: PublicProject;
  notice: string | null;
  onClose: () => void;
  standalone?: boolean;
};

function formatProjectDate(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("es-GT", {
    month: "short",
    year: "numeric",
  })
    .format(new Date(value))
    .replace(".", "")
    .toUpperCase();
}

export function ProjectCard({
  project,
  index,
  total,
  nextProject,
  onOpen,
}: {
  project: PublicProject;
  index: number;
  total: number;
  nextProject: PublicProject | null;
  onOpen: (project: PublicProject) => void;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const cover = project.images.at(0) ?? null;
  const nextCover = nextProject?.images.at(0) ?? null;
  const projectDate = formatProjectDate(project.publishedAt);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.76, 1],
    [0.08, 1, 1, 0.08],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.78, 1],
    [0.94, 1, 1, 0.96],
  );
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [48, 0, 0, -36]);

  return (
    <motion.article
      ref={cardRef}
      className={`group/project relative min-h-[105svh] min-w-0 ${
        index > 0 ? "lg:-mt-[22svh]" : ""
      }`}
      style={
        shouldReduceMotion
          ? { zIndex: total - index }
          : { opacity, scale, y, zIndex: total - index }
      }
    >
      <button
        type="button"
        className="soft-panel soft-panel-interactive sticky top-[clamp(1rem,5vh,3.5rem)] grid min-h-[min(76svh,48rem)] w-full cursor-pointer overflow-hidden rounded-[clamp(1.25rem,2.5vw,2.25rem)] text-left text-foreground lg:grid-cols-[minmax(15rem,0.72fr)_minmax(22rem,1.28fr)]"
        onClick={() => onOpen(project)}
        aria-label={`Abrir detalles del proyecto ${project.title}`}
        data-cursor="action"
      >
        <span className="absolute inset-0 z-20 rounded-[inherit] opacity-0 shadow-[inset_0_0_0_0.125rem_var(--accent)] transition duration-500 group-hover/project:inset-[0.65rem] group-hover/project:opacity-100 group-focus-visible/project:inset-[0.65rem] group-focus-visible/project:opacity-100" />

        <span className="relative min-h-[clamp(22rem,52vw,44rem)] overflow-hidden bg-[var(--surface-raised)] p-[clamp(1rem,3vw,3rem)] lg:order-2">
          {nextCover ? (
            <img
              src={nextCover.url}
              alt=""
              className="absolute inset-[13%_7%_7%_19%] h-[80%] w-[74%] translate-x-[8%] rounded-[clamp(1rem,2vw,2rem)] border border-[var(--line)] object-cover opacity-55 transition-transform duration-700 group-hover/project:translate-x-[12%]"
              aria-hidden="true"
            />
          ) : (
            <span className="absolute inset-[13%_7%_7%_19%] translate-x-[8%] rounded-[clamp(1rem,2vw,2rem)] border border-[var(--line)] bg-[var(--surface)] transition-transform duration-700 group-hover/project:translate-x-[12%]" />
          )}
          <span className="absolute inset-[10%_10%_10%_15%] translate-x-[4%] rounded-[clamp(1rem,2vw,2rem)] border border-[var(--line)] bg-[var(--surface-raised)] transition-transform duration-700 group-hover/project:translate-x-[7%]" />

          {cover ? (
            <img
              src={cover.url}
              alt={cover.altText ?? `Vista previa de ${project.title}`}
              className="relative z-10 h-full w-full rounded-[clamp(1rem,2vw,2rem)] object-cover saturate-[0.82] shadow-[0_2.5rem_5rem_-2.5rem_rgba(0,0,0,0.72)] transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:scale-[1.025] group-hover/project:saturate-100 group-focus-visible/project:scale-[1.025] group-focus-visible/project:saturate-100"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="relative z-10 grid h-full min-h-[18rem] place-items-center rounded-[clamp(1rem,2vw,2rem)] bg-[var(--surface)] text-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
              <FiImage className="size-[clamp(3rem,7vw,6rem)]" aria-hidden="true" />
            </span>
          )}

          <span className="pointer-events-none absolute inset-[clamp(1rem,3vw,3rem)] z-10 rounded-[clamp(1rem,2vw,2rem)] bg-gradient-to-t from-[color-mix(in_srgb,var(--background)_58%,transparent)] via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover/project:opacity-20 group-focus-visible/project:opacity-20" />

          <span className="absolute top-[clamp(2rem,5vw,5rem)] right-[clamp(2rem,5vw,5rem)] z-20 grid size-[clamp(2.75rem,4vw,3.8rem)] place-items-center rounded-full border border-[color-mix(in_srgb,var(--foreground)_32%,transparent)] bg-[color-mix(in_srgb,var(--background)_72%,transparent)] text-foreground opacity-0 backdrop-blur-md transition duration-400 group-hover/project:rotate-45 group-hover/project:scale-110 group-hover/project:opacity-100 group-focus-visible/project:rotate-45 group-focus-visible/project:scale-110 group-focus-visible/project:opacity-100"
            data-blue-icon
          >
            <FiArrowUpRight className="size-[clamp(1rem,1.5vw,1.35rem)]" aria-hidden="true" />
          </span>
        </span>

        <span className="relative z-10 grid content-between gap-[clamp(1.5rem,3vw,3rem)] border-t border-[var(--line)] p-[clamp(1.5rem,3vw,3rem)] lg:order-1 lg:border-t-0 lg:border-r">
          <span className="flex flex-wrap items-center justify-between gap-3 font-mono text-[clamp(0.58rem,0.67vw,0.72rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
            <span>{project.category?.name ?? "Proyecto digital"}</span>
            <span>{projectDate ?? String(index + 1).padStart(2, "0")}</span>
          </span>

          <span className="grid gap-3">
            <strong className="text-[clamp(1.45rem,2.5vw,2.85rem)] leading-[0.98] font-medium tracking-[-0.045em]">
              {project.title}
            </strong>
            {project.shortDescription && (
              <span className="line-clamp-2 max-w-[52ch] text-[clamp(0.88rem,1vw,1rem)] leading-[1.6] text-[var(--muted)]">
                {project.shortDescription}
              </span>
            )}
          </span>

          <span className="flex items-center gap-3 font-mono text-[clamp(0.58rem,0.67vw,0.72rem)] tracking-[0.08em] text-[var(--muted)] uppercase">
            <FiLayers className="text-[var(--accent)]" aria-hidden="true" data-blue-icon />
            {project.technologies.length} tecnologías
          </span>
        </span>
      </button>
    </motion.article>
  );
}

function CarouselProjectCard({
  project,
  index,
  total,
  progress,
  onOpen,
}: {
  project: PublicProject;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onOpen: (project: PublicProject) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const cover = project.images.at(0) ?? null;
  const step = total > 1 ? 1 / (total - 1) : 1;
  const activePoint = total > 1 ? index * step : 0;
  const baseX = ((index % 3) - 1) * 34 + index * 3;
  const baseY = Math.min(index * 20, 86);
  const baseRotate = ((index % 3) - 1) * 3.4;

  const opacity = useTransform(progress, (value) => {
    const distance = (value - activePoint) / step;

    if (distance >= 0) {
      return Math.max(0, 1 - distance * 1.55);
    }

    return Math.max(0.18, 1 - Math.abs(distance) * 0.26);
  });
  const scale = useTransform(progress, (value) => {
    const distance = (value - activePoint) / step;
    if (distance >= 0) return Math.max(0.86, 1 - distance * 0.14);
    return Math.max(0.7, 1 - Math.abs(distance) * 0.075);
  });
  const x = useTransform(progress, (value) => {
    const distance = (value - activePoint) / step;
    if (distance >= 0) return distance * -170;
    return baseX + Math.abs(distance) * 8;
  });
  const y = useTransform(progress, (value) => {
    const distance = (value - activePoint) / step;
    if (distance >= 0) return distance * -110;
    return baseY + Math.abs(distance) * 12;
  });
  const rotate = useTransform(progress, (value) => {
    const distance = (value - activePoint) / step;
    if (distance >= 0) return distance * -8;
    return baseRotate;
  });
  const zIndex = useTransform(progress, (value) =>
    Math.max(1, 1000 - Math.round(Math.abs(value - activePoint) * 1000)),
  );
  const pointerEvents = useTransform(progress, (value) =>
    Math.abs(value - activePoint) <= step * 0.48 ? "auto" : "none",
  );

  return (
    <motion.button
      type="button"
      className="group/carousel absolute left-1/2 top-1/2 grid h-[clamp(24rem,65vh,44rem)] w-[clamp(17rem,47vw,40rem)] -translate-x-1/2 -translate-y-1/2 cursor-pointer grid-rows-[1fr_auto] overflow-hidden rounded-[clamp(1rem,2vw,1.75rem)] border border-[var(--line)] bg-[var(--surface-raised)] text-left text-foreground shadow-[0_3rem_7rem_-3.5rem_rgba(0,0,0,0.8)]"
      style={
        shouldReduceMotion
          ? { zIndex: total - index }
          : { opacity, scale, x, y, rotate, zIndex, pointerEvents }
      }
      whileHover={shouldReduceMotion ? undefined : { scale: 1.025 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.975 }}
      onClick={() => onOpen(project)}
      aria-label={`Abrir proyecto ${project.title}`}
      data-cursor="action"
    >
      <span className="relative min-h-0 overflow-hidden bg-[var(--surface)]">
        {cover ? (
          <img
            src={cover.url}
            alt={cover.altText ?? `Vista previa de ${project.title}`}
            className="h-full w-full object-cover saturate-[0.84] transition duration-700 group-hover/carousel:scale-[1.035] group-hover/carousel:saturate-100"
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <span className="grid h-full place-items-center text-[color-mix(in_srgb,var(--foreground)_14%,transparent)]">
            <FiImage className="size-[clamp(4rem,9vw,8rem)]" aria-hidden="true" />
          </span>
        )}

        <span className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--background)_78%,transparent)] via-transparent to-transparent opacity-65" />
        <span className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-white/30 bg-black/30 text-white opacity-0 backdrop-blur-md transition duration-300 group-hover/carousel:rotate-45 group-hover/carousel:opacity-100">
          <FiArrowUpRight aria-hidden="true" />
        </span>
      </span>

      <span className="relative grid gap-3 border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--surface-raised)_92%,transparent)] p-[clamp(1rem,2vw,1.6rem)] backdrop-blur-xl">
        <span className="flex items-center justify-between gap-4 font-mono text-[clamp(0.54rem,0.64vw,0.7rem)] tracking-[0.09em] text-[var(--muted)] uppercase">
          <span>{project.category?.name ?? "Proyecto digital"}</span>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </span>
        <strong className="text-[clamp(1.35rem,2.7vw,2.75rem)] leading-[0.96] font-medium tracking-[-0.045em]">
          {project.title}
        </strong>
      </span>
    </motion.button>
  );
}

function ProjectsCarousel({
  projects,
  onOpen,
}: {
  projects: PublicProject[];
  onOpen: (project: PublicProject) => void;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  if (shouldReduceMotion) {
    return (
      <section className="grid gap-8" aria-label="Proyectos publicados">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            nextProject={projects.at(index + 1) ?? null}
            onOpen={onOpen}
          />
        ))}
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${Math.max(projects.length, 1) * 88 + 70}svh` }}
      aria-label="Carrusel de proyectos publicados"
    >
      <div className="soft-panel sticky top-0 h-svh min-h-[38rem] overflow-hidden rounded-[clamp(1.25rem,2.5vw,2.5rem)] bg-[radial-gradient(circle_at_50%_48%,color-mix(in_srgb,var(--foreground)_7%,transparent),transparent_48%)]">
        <div className="absolute inset-x-[clamp(1rem,3vw,3rem)] top-[clamp(1rem,3vw,2.5rem)] z-[1200] flex items-center justify-between gap-5 font-mono text-[clamp(0.56rem,0.66vw,0.72rem)] tracking-[0.09em] text-[var(--muted)] uppercase">
          <span>PROYECTOS / CARRUSEL</span>
          <span>SCROLL PARA EXPLORAR</span>
        </div>

        <div className="pointer-events-none absolute inset-x-[clamp(1rem,3vw,3rem)] bottom-[clamp(1rem,3vw,2.5rem)] z-[1200] grid gap-3">
          <div className="h-px overflow-hidden bg-[var(--line)]">
            <motion.span
              className="block h-full origin-left bg-foreground"
              style={{ scaleX: shouldReduceMotion ? 1 : scrollYProgress }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[clamp(0.52rem,0.6vw,0.66rem)] tracking-[0.08em] text-[var(--muted)] uppercase">
            <span>DESVANECER</span>
            <span>SELECCIONAR PROYECTO</span>
            <span>APILAR</span>
          </div>
        </div>

        {projects.map((project, index) => (
          <CarouselProjectCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCompanion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 105, damping: 17, mass: 0.55 });
  const smoothY = useSpring(pointerY, { stiffness: 105, damping: 17, mass: 0.55 });
  const headX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const headY = useTransform(smoothY, [-1, 1], [-7, 7]);
  const headRotateY = useTransform(smoothX, [-1, 1], [-13, 13]);
  const headRotateX = useTransform(smoothY, [-1, 1], [9, -9]);
  const eyesX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const eyesY = useTransform(smoothY, [-1, 1], [-6, 6]);
  const bodyX = useTransform(smoothX, [-1, 1], [-3, 3]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const followPointer = (event: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const bounds = container.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height * 0.36;
      const horizontalReach = Math.max(window.innerWidth * 0.34, 1);
      const verticalReach = Math.max(window.innerHeight * 0.34, 1);

      pointerX.set(
        Math.max(-1, Math.min(1, (event.clientX - centerX) / horizontalReach)),
      );
      pointerY.set(
        Math.max(-1, Math.min(1, (event.clientY - centerY) / verticalReach)),
      );
    };

    window.addEventListener("pointermove", followPointer, { passive: true });
    return () => window.removeEventListener("pointermove", followPointer);
  }, [pointerX, pointerY, shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      className="relative grid min-h-[clamp(14rem,24vw,20rem)] place-items-center overflow-hidden rounded-[clamp(1.25rem,2vw,2rem)] bg-[color-mix(in_srgb,var(--surface-raised)_70%,transparent)]"
      aria-hidden="true"
    >
      <motion.span
        className="pointer-events-none absolute size-[60%] rounded-full bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] blur-[2.5rem]"
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.08, 0.9] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative flex h-full w-full items-end justify-center">
        <motion.div
          className="absolute bottom-[38%] z-10 grid size-[clamp(5rem,8vw,7rem)] place-items-center rounded-full bg-[radial-gradient(circle_at_34%_24%,#424242_0%,#181818_46%,#070707_100%)] shadow-[inset_-1rem_-1.2rem_2.2rem_rgba(0,0,0,0.5),0_1.5rem_3rem_-1.4rem_rgba(0,0,0,0.8)] [transform-style:preserve-3d]"
          style={
            shouldReduceMotion
              ? undefined
              : {
                  x: headX,
                  y: headY,
                  rotateX: headRotateX,
                  rotateY: headRotateY,
                  transformPerspective: 600,
                }
          }
        >
          <motion.span
            className="flex gap-[clamp(0.7rem,1.2vw,1rem)]"
            style={
              shouldReduceMotion
                ? { z: 16 }
                : { x: eyesX, y: eyesY, z: 16 }
            }
            animate={
              shouldReduceMotion
                ? undefined
                : { scaleY: [1, 1, 0.12, 1, 1] }
            }
            transition={{
              duration: 4.6,
              times: [0, 0.72, 0.76, 0.8, 1],
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <span className="h-[clamp(1.1rem,1.6vw,1.4rem)] w-[clamp(0.75rem,1vw,1rem)] rounded-full bg-white shadow-[0_0_1rem_rgba(255,255,255,0.42)]" />
            <span className="h-[clamp(1.1rem,1.6vw,1.4rem)] w-[clamp(0.75rem,1vw,1rem)] rounded-full bg-white shadow-[0_0_1rem_rgba(255,255,255,0.42)]" />
          </motion.span>
        </motion.div>

        <motion.div
          className="h-[46%] w-[min(68%,15rem)] rounded-t-[50%] bg-[radial-gradient(circle_at_42%_8%,#303030_0%,#151515_50%,#060606_100%)] shadow-[inset_-2rem_-2rem_4rem_rgba(0,0,0,0.44)]"
          style={shouldReduceMotion ? undefined : { x: bodyX }}
        />
      </div>
    </div>
  );
}

export function ProjectModal({
  project,
  notice,
  onClose,
  standalone = false,
}: ProjectModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const projectDate = formatProjectDate(project.publishedAt);

  useEffect(() => {
    if (standalone) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, standalone]);

  return (
    <motion.div
      className={
        standalone
          ? "relative min-h-svh w-full overflow-x-clip bg-background"
          : "fixed inset-0 z-[250] grid h-svh place-items-center overflow-hidden bg-[color-mix(in_srgb,var(--background)_82%,transparent)] backdrop-blur-xl"
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.08 : 0.3 }}
      onMouseDown={
        standalone
          ? undefined
          : (event) => {
              if (event.target === event.currentTarget) onClose();
            }
      }
    >
      <motion.article
        className={
          standalone
            ? "relative grid min-h-svh w-full bg-background text-foreground"
            : "soft-panel relative grid h-svh w-full overflow-y-auto rounded-none bg-background text-foreground"
        }
        role={standalone ? undefined : "dialog"}
        aria-modal={standalone ? undefined : "true"}
        aria-labelledby="project-dialog-title"
        initial={shouldReduceMotion ? false : { opacity: 0, y: "2rem", scale: 0.975 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: "1rem", scale: 0.985 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          className={`soft-icon-button top-[clamp(0.75rem,1.5vw,1.5rem)] right-[clamp(0.75rem,1.5vw,1.5rem)] z-40 grid size-[clamp(2.75rem,4vw,3.6rem)] cursor-pointer place-items-center rounded-full text-foreground hover:rotate-90 focus-visible:rotate-90 ${
            standalone ? "fixed" : "absolute"
          }`}
          onClick={onClose}
          aria-label="Cerrar detalle del proyecto"
          data-cursor="action"
        >
          <FiX className="size-[clamp(1rem,1.4vw,1.25rem)]" aria-hidden="true" />
        </button>

        <div className="grid min-w-0 pt-[clamp(3.5rem,5vw,5rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:pt-0">
          <section className="grid min-w-0 content-start gap-[clamp(1.5rem,3vw,3rem)] p-[clamp(1.25rem,3.5vw,4rem)] shadow-[inset_0_-0.0625rem_0_var(--line-soft)] lg:shadow-[inset_-0.0625rem_0_0_var(--line-soft)]">
            <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
              <span>{project.category?.name ?? "Proyecto digital"}</span>
              <span>{projectDate ?? "PUBLICADO"}</span>
            </div>

            <div className="grid gap-[clamp(1rem,2vw,1.75rem)]">
              <h2
                id="project-dialog-title"
                className="m-0 max-w-[14ch] text-[clamp(2.5rem,6vw,7rem)] leading-[0.86] font-normal tracking-[-0.065em]"
              >
                {project.title}
              </h2>

              {project.shortDescription && (
                <p className="m-0 max-w-[54ch] text-[clamp(1rem,1.3vw,1.3rem)] leading-[1.62] text-[var(--muted)]">
                  {project.shortDescription}
                </p>
              )}
            </div>

            {notice && (
              <p className="m-0 border-l-[0.125rem] border-[var(--accent)] pl-4 font-mono text-[clamp(0.62rem,0.72vw,0.78rem)] leading-[1.6] tracking-[0.04em] text-[var(--muted)] uppercase">
                {notice}
              </p>
            )}

            {project.images.length > 0 ? (
              <div className="grid gap-4">
                {project.images.map((image, index) => (
                  <motion.figure
                    className="soft-media m-0 overflow-hidden rounded-[clamp(0.75rem,1.5vw,1.25rem)] bg-[var(--surface)]"
                    key={image.id}
                    initial={{ opacity: 0, y: "1rem" }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <img
                      src={image.url}
                      alt={image.altText ?? `${project.title}, imagen ${index + 1}`}
                      className="block h-auto max-h-[44rem] w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    {(image.title || image.altText) && (
                      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-[clamp(1rem,2vw,1.5rem)] py-3 font-mono text-[clamp(0.56rem,0.66vw,0.72rem)] tracking-[0.08em] text-[var(--muted)] uppercase">
                        <span>{image.title ?? image.altText}</span>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                      </figcaption>
                    )}
                  </motion.figure>
                ))}
              </div>
            ) : (
              <div className="soft-panel grid min-h-[clamp(18rem,32vw,30rem)] place-items-center text-[color-mix(in_srgb,var(--foreground)_14%,transparent)]">
                <span className="font-display text-[clamp(5rem,13vw,12rem)] tracking-[-0.08em]">
                  AX
                </span>
              </div>
            )}
          </section>

          <aside className="grid min-w-0 content-start gap-[clamp(2rem,4vw,4rem)] p-[clamp(1.25rem,3.5vw,4rem)]">
            <ProjectCompanion />

            <section className="grid gap-5">
              <span className="font-mono text-[clamp(0.6rem,0.7vw,0.76rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
                DETALLE / 01
              </span>
              <p className="m-0 whitespace-pre-line text-[clamp(0.98rem,1.16vw,1.18rem)] leading-[1.75] text-foreground">
                {project.longDescription ??
                  project.shortDescription ??
                  "Este proyecto todavía no cuenta con una descripción ampliada."}
              </p>
            </section>

            <section className="grid gap-5">
              <span className="font-mono text-[clamp(0.6rem,0.7vw,0.76rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
                TECNOLOGÍAS / 02
              </span>

              {project.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((technology) => (
                    <span
                      className="soft-chip group/technology inline-flex items-center gap-3 px-4 py-3 font-mono text-[clamp(0.6rem,0.7vw,0.76rem)] tracking-[0.06em] uppercase hover:-translate-y-[0.2rem]"
                      key={technology.id}
                    >
                      <span
                        className="text-[var(--accent)] transition-transform duration-300 group-hover/technology:scale-125"
                        data-blue-icon
                      >
                        <TechnologyGlyph
                          name={technology.name}
                          iconKey={technology.iconKey}
                          className="size-[clamp(0.9rem,1.2vw,1.1rem)]"
                        />
                      </span>
                      {technology.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="m-0 text-[var(--muted)]">
                  No hay tecnologías asociadas públicamente.
                </p>
              )}
            </section>

            {(project.liveUrl || project.repositoryUrl) && (
              <section className="grid gap-5">
                <span className="font-mono text-[clamp(0.6rem,0.7vw,0.76rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
                  ENLACES / 03
                </span>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ui-button-primary group/link inline-flex items-center justify-between gap-4 px-[clamp(1rem,1.8vw,1.35rem)] py-[clamp(0.9rem,1.2vw,1.05rem)] no-underline"
                      data-cursor="action"
                    >
                      <span>Ver proyecto</span>
                      <FiExternalLink className="transition-transform duration-300 group-hover/link:scale-115" aria-hidden="true" />
                    </a>
                  )}

                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ui-button-secondary group/link inline-flex items-center justify-between gap-4 px-[clamp(1rem,1.8vw,1.35rem)] py-[clamp(0.9rem,1.2vw,1.05rem)] no-underline"
                      data-cursor="action"
                    >
                      <span>Repositorio</span>
                      <FiGithub className="transition-transform duration-300 group-hover/link:scale-115" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </section>
            )}
          </aside>
        </div>
      </motion.article>
    </motion.div>
  );
}

function ProjectsContent({
  projects,
  total,
}: {
  projects: PublicProject[];
  total: number;
}) {
  const router = useRouter();
  const [loadingProject, setLoadingProject] = useState<PublicProject | null>(null);
  const featuredCount = useMemo(
    () => projects.filter((project) => project.isFeatured).length,
    [projects],
  );

  const openProject = (project: PublicProject) => {
    if (loadingProject) return;

    setLoadingProject(project);
    window.setTimeout(() => {
      router.push(`/projects/${encodeURIComponent(project.slug)}`);
    }, 180);
  };

  return (
    <>
      <div className="soft-strip mb-[clamp(1.5rem,3vw,3rem)] flex flex-wrap items-center justify-between gap-5 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(1rem,2vw,1.5rem)] font-mono text-[clamp(0.6rem,0.72vw,0.78rem)] tracking-[0.09em] text-[var(--muted)] uppercase">
        <span>{total} proyectos publicados</span>
        <span>{featuredCount} destacados</span>
      </div>

      <ProjectsCarousel projects={projects} onOpen={openProject} />

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {loadingProject && (
              <ProjectDetailLoader title={loadingProject.title} />
            )}
          </AnimatePresence>,
          document.body,
        )}

    </>
  );
}

export function ProjectsView({ result }: ProjectsViewProps) {
  return (
    <SectionPageShell
      section={SECTION_ITEMS[1]}
      eyebrow="SELECCIÓN DE TRABAJO"
      intro="Una galería secuencial de sistemas, productos e integraciones. Cada proyecto toma el escenario durante el scroll y, al seleccionarlo, se abre su caso completo en una vista enfocada."
    >
      {result.status === "success" && (
        <ProjectsContent
          projects={result.data.projects}
          total={result.data.meta.total}
        />
      )}

      {result.status === "empty" && (
        <ContentState
          type="empty"
          title="Aún no hay proyectos publicados."
          message="En cuanto exista contenido público en el administrador, aparecerá automáticamente en este collage."
        />
      )}

      {result.status === "error" && (
        <ContentState
          type="error"
          title="No pudimos cargar los proyectos."
          message={result.message}
        />
      )}
    </SectionPageShell>
  );
}
