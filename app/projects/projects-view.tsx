"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiLayers } from "react-icons/fi";
import { ContentState } from "../components/content-state";
import { MagneticTitle } from "../components/magnetic-title";
import { SECTION_ITEMS } from "../components/navigation-config";
import { RouteTransitionLink } from "../components/route-transition-link";
import { SectionPageShell } from "../components/section-page-shell";
import type { PublicProject, PublicProjectsLoadResult } from "../lib/public-api";
import styles from "./projects.module.css";

type ProjectsViewProps = { result: PublicProjectsLoadResult };
const PROJECTS_PER_PAGE = 6;

function formatProjectDate(value: string | null) {
  if (!value) return "Proyecto seleccionado";
  return new Intl.DateTimeFormat("es-MX", { month: "short", year: "numeric" }).format(new Date(value)).replace(".", "").toUpperCase();
}

function ProjectCard({ project, index, total }: {
  project: PublicProject;
  index: number;
  total: number;
}) {
  return (
    <motion.article
      className={styles.cardScene}
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.07, 0.28), ease: [0.22, 1, 0.36, 1] }}
    >
      <RouteTransitionLink href={`/projects/${encodeURIComponent(project.slug)}`} className={styles.folderCard} ariaLabel={`Ver detalles de ${project.title}`}>
        <span className={styles.folderPaper} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.folderShape} aria-hidden="true" />
        <span className={styles.folderContent}>
          <span className={styles.folderTopline}>
            <span>{project.category?.name ?? "Proyecto digital"}</span>
            <span className={styles.arrow} aria-hidden="true"><FiArrowUpRight /></span>
          </span>

          <span className={styles.folderCopy}>
            <MagneticTitle as="strong" text={project.title} className={styles.folderTitle} />
            <span>{project.shortDescription ?? "Una solución digital concebida con atención al detalle, la experiencia y el rendimiento."}</span>
          </span>

          <span className={styles.cardFooter}>
            <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {formatProjectDate(project.publishedAt)}</span>
            <span><FiLayers aria-hidden="true" />{project.technologies.length} tecnologías</span>
          </span>
        </span>
      </RouteTransitionLink>
    </motion.article>
  );
}

function ProjectsContent({ projects }: { projects: PublicProject[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsGridRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const firstProjectIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const visibleProjects = projects.slice(firstProjectIndex, firstProjectIndex + PROJECTS_PER_PAGE);

  const goToPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    if (nextPage === currentPage) return;

    setCurrentPage(nextPage);
    window.requestAnimationFrame(() => {
      projectsGridRef.current?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  return <>
    <svg className={styles.folderClipDefs} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="project-folder-shape" clipPathUnits="objectBoundingBox">
          <path d="M .075 .075 H .44 L .55 0 H .925 C .968 0 1 .032 1 .075 V .925 C 1 .968 .968 1 .925 1 H .075 C .032 1 0 .968 0 .925 V .15 C 0 .108 .032 .075 .075 .075 Z" />
        </clipPath>
      </defs>
    </svg>
    <section ref={projectsGridRef} className={styles.projectsGrid} aria-label="Listado de proyectos" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        {visibleProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={firstProjectIndex + index}
            total={projects.length}
          />
        ))}
      </AnimatePresence>
    </section>

    {totalPages > 1 && (
      <nav className={styles.pagination} aria-label="Paginación de proyectos">
        <div className={styles.paginationStatus} aria-live="polite">
          <span>Página {String(currentPage).padStart(2, "0")}</span>
          <span>{String(firstProjectIndex + 1).padStart(2, "0")}—{String(Math.min(firstProjectIndex + PROJECTS_PER_PAGE, projects.length)).padStart(2, "0")} de {String(projects.length).padStart(2, "0")}</span>
        </div>

        <div className={styles.paginationTrack} aria-hidden="true">
          <span style={{ transform: `scaleX(${currentPage / totalPages})` }} />
        </div>

        <div className={styles.paginationControls}>
          <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Ir a la página anterior" data-cursor="action">
            <FiArrowLeft aria-hidden="true" />
          </button>
          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={page === currentPage ? styles.activePage : undefined}
                onClick={() => goToPage(page)}
                aria-label={`Ir a la página ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                data-cursor="action"
              >
                {String(page).padStart(2, "0")}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Ir a la página siguiente" data-cursor="action">
            <FiArrowRight aria-hidden="true" />
          </button>
        </div>
      </nav>
    )}
  </>;
}

export function ProjectsView({ result }: ProjectsViewProps) {
  return <SectionPageShell section={SECTION_ITEMS[1]} eyebrow="TRABAJO SELECCIONADO" intro="Productos digitales, sistemas e interfaces construidos para resolver necesidades reales. Abre cualquier carpeta para explorar el caso completo." showExploreHint={false}>
    {result.status === "success" && <ProjectsContent projects={result.data.projects} />}
    {result.status === "empty" && <ContentState type="empty" title="Aún no hay proyectos publicados." message="Los próximos casos de estudio aparecerán aquí automáticamente." />}
    {result.status === "error" && <ContentState type="error" title="No pudimos cargar los proyectos." message={result.message} />}
  </SectionPageShell>;
}
