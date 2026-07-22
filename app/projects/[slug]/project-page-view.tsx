"use client";

/* eslint-disable @next/next/no-img-element */

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowUpRight, FiExternalLink, FiGithub, FiImage } from "react-icons/fi";
import { TechnologyGlyph } from "../../components/technology-glyph";
import type { PublicProject } from "../../lib/public-api";
import { GalleryLightbox } from "../gallery-lightbox";
import { ProjectDetailLoader } from "../project-detail-loader";
import styles from "../projects.module.css";

function formatDate(value: string | null) {
  if (!value) return "Publicado";
  return new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" }).format(new Date(value));
}

export function ProjectPageView({ project }: { project: PublicProject }) {
  const [isLoading, setIsLoading] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const cover = project.images.at(0) ?? null;

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setIsLoading(false), 620);
    return () => window.clearTimeout(loadingTimer);
  }, []);

  if (isLoading) {
    return <ProjectDetailLoader title={project.title} />;
  }

  return (
    <main className={styles.detailPage}>
      <motion.section className={styles.detailHero} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
        <Link href="/projects" className={styles.backLink} data-cursor="action"><FiArrowLeft aria-hidden="true" />Todos los proyectos</Link>
        <div className={styles.detailEyebrow}>
          <span>{project.category?.name ?? "Proyecto digital"}</span>
          <span>{formatDate(project.publishedAt)}</span>
        </div>
        <div className={styles.detailTitleRow}>
          <h1>{project.title}</h1>
          <span aria-hidden="true">CASE<br />STUDY</span>
        </div>
        <div className={styles.detailIntro}>
          <p>{project.shortDescription ?? "Una solución digital diseñada con intención, claridad y atención al detalle."}</p>
          <div className={styles.detailActions}>
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" data-cursor="action">Ver proyecto<FiExternalLink aria-hidden="true" /></a>}
            {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" data-cursor="action">Repositorio<FiGithub aria-hidden="true" /></a>}
          </div>
        </div>
      </motion.section>

      <section className={styles.detailCover}>
        {cover ? <img src={cover.url} alt={cover.altText ?? `Portada de ${project.title}`} decoding="async" /> : <span className={styles.detailPlaceholder}><FiImage aria-hidden="true" /></span>}
        {project.images.length > 0 && <button type="button" onClick={() => setGalleryIndex(0)} data-cursor="action"><FiImage aria-hidden="true" />Abrir galería <span>{String(project.images.length).padStart(2, "0")}</span></button>}
      </section>

      <section className={styles.detailBody}>
        <div className={styles.detailLabel}><span>01</span><span>El proyecto</span></div>
        <div className={styles.detailText}>
          <p>{project.longDescription ?? project.shortDescription ?? "Este proyecto todavía no cuenta con una descripción ampliada."}</p>
        </div>
        <aside className={styles.detailFacts}>
          <span>Tecnologías</span>
          <div>
            {project.technologies.length > 0 ? project.technologies.map((technology) => (
              <span key={technology.id}><TechnologyGlyph name={technology.name} iconKey={technology.iconKey} />{technology.name}</span>
            )) : <p>Stack no publicado</p>}
          </div>
        </aside>
      </section>

      {project.images.length > 1 && (
        <section className={styles.detailGallery}>
          <div className={styles.detailGalleryHeading}>
            <div className={styles.detailLabel}><span>02</span><span>Galería</span></div>
            <p>Una mirada más cercana al producto, sus pantallas y decisiones visuales.</p>
          </div>
          <div className={styles.detailGalleryGrid}>
            {project.images.slice(1).map((image, index) => (
              <button type="button" key={image.id} onClick={() => setGalleryIndex(index + 1)} aria-label={`Ampliar imagen ${index + 2}`} data-cursor="action">
                <img src={image.url} alt={image.altText ?? `${project.title}, imagen ${index + 2}`} loading="lazy" decoding="async" />
                <span><span>{image.title ?? `Vista ${String(index + 2).padStart(2, "0")}`}</span><FiArrowUpRight aria-hidden="true" /></span>
              </button>
            ))}
          </div>
        </section>
      )}

      <footer className={styles.detailFooter}>
        <span>Fin del proyecto</span>
        <Link href="/projects" data-cursor="action">Volver a proyectos<FiArrowUpRight aria-hidden="true" /></Link>
      </footer>

      {galleryIndex !== null && <GalleryLightbox images={project.images} projectTitle={project.title} initialIndex={galleryIndex} onClose={() => setGalleryIndex(null)} />}
    </main>
  );
}
