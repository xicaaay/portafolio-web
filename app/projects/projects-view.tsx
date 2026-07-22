"use client";

/* eslint-disable @next/next/no-img-element */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiArrowUpRight, FiImage, FiLayers } from "react-icons/fi";
import { ContentState } from "../components/content-state";
import { SECTION_ITEMS } from "../components/navigation-config";
import { SectionPageShell } from "../components/section-page-shell";
import type { PublicProject, PublicProjectsLoadResult } from "../lib/public-api";
import { GalleryLightbox } from "./gallery-lightbox";
import { ProjectDetailLoader } from "./project-detail-loader";
import styles from "./projects.module.css";

type ProjectsViewProps = { result: PublicProjectsLoadResult };

function formatProjectDate(value: string | null) {
  if (!value) return "Proyecto seleccionado";
  return new Intl.DateTimeFormat("es-MX", { month: "short", year: "numeric" }).format(new Date(value)).replace(".", "").toUpperCase();
}

function ProjectCard({ project, index, onNavigate, onGallery }: {
  project: PublicProject;
  index: number;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, project: PublicProject) => void;
  onGallery: (project: PublicProject) => void;
}) {
  const cover = project.images.at(0) ?? null;

  return (
    <motion.article className={styles.card} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.62, delay: Math.min(index * 0.08, 0.24), ease: [0.22, 1, 0.36, 1] }}>
      <div className={styles.media}>
        {cover ? <img src={cover.url} alt={cover.altText ?? `Vista previa de ${project.title}`} loading={index < 3 ? "eager" : "lazy"} decoding="async" /> : <span className={styles.mediaPlaceholder} aria-hidden="true"><FiImage /></span>}
        <span className={styles.mediaShade} aria-hidden="true" />
        <span className={styles.cardIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        {project.images.length > 0 && <button type="button" className={styles.galleryButton} onClick={() => onGallery(project)} aria-label={`Abrir galería de ${project.title}`} data-cursor="action"><FiImage aria-hidden="true" /><span>Galería</span><span>{String(project.images.length).padStart(2, "0")}</span></button>}
      </div>
      <div className={styles.cardCopy}>
        <div className={styles.cardMeta}><span>{project.category?.name ?? "Proyecto digital"}</span><span>{formatProjectDate(project.publishedAt)}</span></div>
        <div className={styles.cardHeading}><h2>{project.title}</h2><span className={styles.arrow} aria-hidden="true"><FiArrowUpRight /></span></div>
        <p>{project.shortDescription ?? "Una solución digital concebida con atención al detalle, la experiencia y el rendimiento."}</p>
        <div className={styles.cardFooter}><span><FiLayers aria-hidden="true" />{project.technologies.length} tecnologías</span><span>Ver caso</span></div>
      </div>
      <Link href={`/projects/${encodeURIComponent(project.slug)}`} className={styles.cardLink} onClick={(event) => onNavigate(event, project)} aria-label={`Abrir el proyecto ${project.title}`} data-cursor="action" />
    </motion.article>
  );
}

function ProjectsContent({ projects, total }: { projects: PublicProject[]; total: number }) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [loadingProject, setLoadingProject] = useState<PublicProject | null>(null);
  const [galleryProject, setGalleryProject] = useState<PublicProject | null>(null);
  const featuredCount = useMemo(() => projects.filter((project) => project.isFeatured).length, [projects]);

  const navigateToProject = (event: MouseEvent<HTMLAnchorElement>, project: PublicProject) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (loadingProject) return;
    setLoadingProject(project);
    window.setTimeout(() => router.push(`/projects/${encodeURIComponent(project.slug)}`), shouldReduceMotion ? 80 : 520);
  };

  return <>
    <div className={styles.collectionMeta}><span>{String(total).padStart(2, "0")} proyectos publicados</span><span>{featuredCount > 0 ? `${featuredCount} destacados` : "Selección 2026"}</span></div>
    <section className={styles.grid} aria-label="Proyectos publicados">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onNavigate={navigateToProject} onGallery={setGalleryProject} />)}</section>
    {typeof document !== "undefined" && createPortal(<>
      <AnimatePresence>{loadingProject && <ProjectDetailLoader title={loadingProject.title} />}</AnimatePresence>
      <AnimatePresence>{galleryProject && <GalleryLightbox images={galleryProject.images} projectTitle={galleryProject.title} onClose={() => setGalleryProject(null)} />}</AnimatePresence>
    </>, document.body)}
  </>;
}

export function ProjectsView({ result }: ProjectsViewProps) {
  return <SectionPageShell section={SECTION_ITEMS[1]} eyebrow="TRABAJO SELECCIONADO" intro="Productos digitales, sistemas e interfaces construidos para resolver necesidades reales. Explora la galería o abre cada proyecto para conocer el caso completo.">
    {result.status === "success" && <ProjectsContent projects={result.data.projects} total={result.data.meta.total} />}
    {result.status === "empty" && <ContentState type="empty" title="Aún no hay proyectos publicados." message="Los próximos casos de estudio aparecerán aquí automáticamente." />}
    {result.status === "error" && <ContentState type="error" title="No pudimos cargar los proyectos." message={result.message} />}
  </SectionPageShell>;
}
