"use client";

/* eslint-disable @next/next/no-img-element */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
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
import type {
  PublicProject,
  PublicProjectsLoadResult,
} from "../lib/public-api";
import { parsePublicProject } from "../lib/public-api";

const COLLAGE_LAYOUTS = [
  "md:col-span-7 xl:col-span-5",
  "md:col-span-5 xl:col-span-7",
  "md:col-span-5 xl:col-span-4",
  "md:col-span-7 xl:col-span-4",
  "md:col-span-12 xl:col-span-4",
  "md:col-span-6 xl:col-span-7",
  "md:col-span-6 xl:col-span-5",
] as const;

const MINIMUM_DETAIL_LOAD_TIME = 640;

type ProjectsViewProps = {
  result: PublicProjectsLoadResult;
};

type ProjectModalProps = {
  project: PublicProject;
  notice: string | null;
  onClose: () => void;
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

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: PublicProject;
  index: number;
  onOpen: (project: PublicProject) => void;
}) {
  const cover = project.images.at(0) ?? null;
  const projectDate = formatProjectDate(project.publishedAt);

  return (
    <motion.article
      className={`${COLLAGE_LAYOUTS[index % COLLAGE_LAYOUTS.length]} group/project min-w-0`}
      initial={{ opacity: 0, y: "1.75rem" }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.62, delay: (index % 4) * 0.06 }}
    >
      <button
        type="button"
        className="relative grid min-h-[clamp(18rem,31vw,33rem)] w-full cursor-pointer grid-rows-[1fr_auto] overflow-hidden border border-[var(--line)] bg-[var(--surface)] text-left text-foreground transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:-translate-y-[0.55rem] group-hover/project:border-foreground group-hover/project:shadow-[0_2.5rem_6rem_color-mix(in_srgb,var(--background)_68%,transparent)] focus-visible:-translate-y-[0.55rem] focus-visible:border-foreground focus-visible:shadow-[0_2.5rem_6rem_color-mix(in_srgb,var(--background)_68%,transparent)] motion-reduce:transform-none motion-reduce:transition-none"
        onClick={() => onOpen(project)}
        aria-label={`Abrir detalles del proyecto ${project.title}`}
        data-cursor="action"
      >
        <span className="absolute inset-0 z-20 border border-transparent transition duration-500 group-hover/project:inset-[0.65rem] group-hover/project:border-[var(--accent)] group-focus-visible/project:inset-[0.65rem] group-focus-visible/project:border-[var(--accent)]" />

        <span className="relative min-h-0 overflow-hidden bg-[var(--surface-raised)]">
          {cover ? (
            <img
              src={cover.url}
              alt={cover.altText ?? `Vista previa de ${project.title}`}
              className="h-full w-full object-cover saturate-[0.78] transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:scale-[1.055] group-hover/project:saturate-100 group-focus-visible/project:scale-[1.055] group-focus-visible/project:saturate-100"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="grid h-full min-h-[12rem] place-items-center text-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
              <FiImage className="size-[clamp(3rem,7vw,6rem)]" aria-hidden="true" />
            </span>
          )}

          <span className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--background)_72%,transparent)] via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover/project:opacity-30 group-focus-visible/project:opacity-30" />

          <span className="absolute top-[clamp(1rem,2vw,1.6rem)] right-[clamp(1rem,2vw,1.6rem)] grid size-[clamp(2.5rem,4vw,3.6rem)] place-items-center rounded-full border border-[color-mix(in_srgb,var(--foreground)_32%,transparent)] bg-[color-mix(in_srgb,var(--background)_58%,transparent)] text-[var(--accent)] opacity-0 backdrop-blur-md transition duration-400 group-hover/project:scale-110 group-hover/project:opacity-100 group-focus-visible/project:scale-110 group-focus-visible/project:opacity-100"
            data-blue-icon
          >
            <FiArrowUpRight className="size-[clamp(1rem,1.5vw,1.35rem)]" aria-hidden="true" />
          </span>
        </span>

        <span className="relative z-10 grid gap-[clamp(0.9rem,1.5vw,1.35rem)] p-[clamp(1.25rem,2.2vw,2rem)]">
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

function ProjectDetailLoader({ title }: { title: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-[260] grid place-items-center bg-[color-mix(in_srgb,var(--background)_88%,transparent)] p-5 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-live="polite"
      aria-label={`Cargando detalles de ${title}`}
    >
      <div className="grid w-full max-w-[32rem] gap-6 border border-[var(--line)] bg-[var(--surface)] p-[clamp(1.5rem,4vw,3rem)]">
        <div className="flex items-center justify-between gap-5 font-mono text-[clamp(0.6rem,0.72vw,0.78rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
          <span>ABRIENDO PROYECTO</span>
          <span>AX / CASE</span>
        </div>

        <h2 className="m-0 text-[clamp(1.8rem,4vw,3.75rem)] leading-[0.95] tracking-[-0.055em]">
          {title}
        </h2>

        <div className="grid gap-2" aria-hidden="true">
          {[0, 1, 2].map((line) => (
            <motion.span
              key={line}
              className="block h-[0.125rem] origin-left bg-foreground"
              initial={{ scaleX: 0, opacity: 0.22 }}
              animate={{ scaleX: [0, 1, 0], opacity: [0.22, 1, 0.22] }}
              transition={{
                duration: 1.15,
                delay: line * 0.12,
                repeat: Infinity,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, notice, onClose }: ProjectModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const projectDate = formatProjectDate(project.publishedAt);

  useEffect(() => {
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
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[250] grid place-items-center overflow-y-auto bg-[color-mix(in_srgb,var(--background)_82%,transparent)] p-[clamp(0.75rem,2vw,2rem)] backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.08 : 0.3 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.article
        className="relative my-auto grid max-h-[calc(100svh-1.5rem)] w-full max-w-[94rem] overflow-y-auto border border-[var(--line)] bg-background text-foreground shadow-[0_3rem_9rem_color-mix(in_srgb,var(--background)_72%,transparent)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        initial={shouldReduceMotion ? false : { opacity: 0, y: "2rem", scale: 0.975 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: "1rem", scale: 0.985 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          className="sticky top-[clamp(0.75rem,1.5vw,1.5rem)] z-40 mr-[clamp(0.75rem,1.5vw,1.5rem)] ml-auto grid size-[clamp(2.75rem,4vw,3.6rem)] cursor-pointer place-items-center rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_78%,transparent)] text-foreground backdrop-blur-xl transition duration-300 hover:rotate-90 hover:border-foreground focus-visible:rotate-90 focus-visible:border-foreground"
          onClick={onClose}
          aria-label="Cerrar detalle del proyecto"
          data-cursor="action"
        >
          <FiX className="size-[clamp(1rem,1.4vw,1.25rem)]" aria-hidden="true" />
        </button>

        <div className="mt-[calc(clamp(2.75rem,4vw,3.6rem)*-1)] grid min-w-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)]">
          <section className="grid min-w-0 content-start gap-[clamp(1.5rem,3vw,3rem)] border-b border-[var(--line)] p-[clamp(1.25rem,3.5vw,4rem)] lg:border-r lg:border-b-0">
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
                    className="m-0 overflow-hidden border border-[var(--line)] bg-[var(--surface)]"
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
              <div className="grid min-h-[clamp(18rem,32vw,30rem)] place-items-center border border-[var(--line)] bg-[var(--surface)] text-[color-mix(in_srgb,var(--foreground)_14%,transparent)]">
                <span className="font-display text-[clamp(5rem,13vw,12rem)] tracking-[-0.08em]">
                  AX
                </span>
              </div>
            )}
          </section>

          <aside className="grid min-w-0 content-start gap-[clamp(2rem,4vw,4rem)] p-[clamp(1.25rem,3.5vw,4rem)]">
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
                      className="group/technology inline-flex items-center gap-3 border border-[var(--line)] bg-[var(--surface)] px-4 py-3 font-mono text-[clamp(0.6rem,0.7vw,0.76rem)] tracking-[0.06em] uppercase transition duration-300 hover:-translate-y-[0.2rem] hover:border-foreground"
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
                      className="group/link inline-flex items-center justify-between gap-4 bg-foreground px-[clamp(1rem,1.8vw,1.35rem)] py-[clamp(0.9rem,1.2vw,1.05rem)] text-background no-underline transition duration-300 hover:-translate-y-[0.2rem] hover:bg-[var(--accent)] focus-visible:-translate-y-[0.2rem] focus-visible:bg-[var(--accent)]"
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
                      className="group/link inline-flex items-center justify-between gap-4 border border-[var(--line)] bg-transparent px-[clamp(1rem,1.8vw,1.35rem)] py-[clamp(0.9rem,1.2vw,1.05rem)] text-foreground no-underline transition duration-300 hover:-translate-y-[0.2rem] hover:border-foreground focus-visible:-translate-y-[0.2rem] focus-visible:border-foreground"
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
  apiBaseUrl,
}: {
  projects: PublicProject[];
  total: number;
  apiBaseUrl: string;
}) {
  const [loadingProject, setLoadingProject] = useState<PublicProject | null>(null);
  const [activeProject, setActiveProject] = useState<PublicProject | null>(null);
  const [detailNotice, setDetailNotice] = useState<string | null>(null);


  const featuredCount = useMemo(
    () => projects.filter((project) => project.isFeatured).length,
    [projects],
  );

  const openProject = async (project: PublicProject) => {
    setLoadingProject(project);
    setDetailNotice(null);

    const startedAt = Date.now();
    let detailedProject = project;
    let notice: string | null = null;

    try {
      const endpoint = `${apiBaseUrl}/public/projects/${encodeURIComponent(project.slug)}`;
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) throw new Error("No se pudo obtener el detalle.");

      const payload: unknown = await response.json();
      const payloadRecord =
        typeof payload === "object" && payload !== null
          ? (payload as Record<string, unknown>)
          : null;
      const parsedProject =
        payloadRecord?.success === true
          ? parsePublicProject(payloadRecord.data, apiBaseUrl)
          : null;

      if (!parsedProject) throw new Error("El detalle no tiene un formato válido.");
      detailedProject = parsedProject;
    } catch {
      notice =
        "El detalle individual no respondió; se muestra la información pública disponible en el listado.";
    }

    const elapsed = Date.now() - startedAt;
    if (elapsed < MINIMUM_DETAIL_LOAD_TIME) {
      await new Promise((resolve) =>
        window.setTimeout(resolve, MINIMUM_DETAIL_LOAD_TIME - elapsed),
      );
    }

    setActiveProject(detailedProject);
    setDetailNotice(notice);
    setLoadingProject(null);
  };

  return (
    <>
      <div className="mb-[clamp(1.5rem,3vw,3rem)] flex flex-wrap items-center justify-between gap-5 border-y border-[var(--line)] py-[clamp(1rem,2vw,1.5rem)] font-mono text-[clamp(0.6rem,0.72vw,0.78rem)] tracking-[0.09em] text-[var(--muted)] uppercase">
        <span>{total} proyectos publicados</span>
        <span>{featuredCount} destacados</span>
      </div>

      <section className="grid grid-cols-1 gap-[clamp(1rem,2vw,1.6rem)] md:grid-cols-12" aria-label="Proyectos publicados">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onOpen={openProject}
          />
        ))}
      </section>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {loadingProject && <ProjectDetailLoader title={loadingProject.title} />}
            {activeProject && !loadingProject && (
              <ProjectModal
                project={activeProject}
                notice={detailNotice}
                onClose={() => {
                  setActiveProject(null);
                  setDetailNotice(null);
                }}
              />
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
      intro="Una colección dinámica de sistemas, productos e integraciones. Cada tarjeta funciona como una vista breve; al seleccionarla se abre el caso completo sin abandonar la sección."
    >
      {result.status === "success" && (
        <ProjectsContent
          projects={result.data.projects}
          total={result.data.meta.total}
          apiBaseUrl={result.data.apiBaseUrl}
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
