"use client";

/* eslint-disable @next/next/no-img-element */

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiChevronDown,
  FiExternalLink,
  FiGithub,
} from "react-icons/fi";
import { RouteTransitionLink } from "../../components/route-transition-link";
import { MagneticTitle } from "../../components/magnetic-title";
import { TechnologyGlyph } from "../../components/technology-glyph";
import type { PublicProject } from "../../lib/public-api";
import { GalleryLightbox } from "../gallery-lightbox";
import styles from "../projects.module.css";

type ProjectTechnology = PublicProject["technologies"][number];

function formatDate(value: string | null) {
  if (!value) return "Publicado";
  return new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function ProjectAction({
  href,
  label,
  detail,
  Icon,
}: {
  href: string;
  label: string;
  detail: string;
  Icon: IconType;
}) {
  return (
    <motion.a
      className={styles.projectAction}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} en una pestaña nueva`}
      data-cursor="action"
      whileTap={{ scale: 0.98 }}
    >
      <span className={styles.projectActionIcon}>
        <Icon aria-hidden="true" />
      </span>
      <span className={styles.projectActionCopy}>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <FiArrowUpRight className={styles.projectActionArrow} aria-hidden="true" />
    </motion.a>
  );
}

function MagneticTechnology({
  technology,
  index,
  reducedMotion,
}: {
  technology: ProjectTechnology;
  index: number;
  reducedMotion: boolean;
}) {
  const [isActive, setIsActive] = useState(false);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, { stiffness: 118, damping: 11, mass: 0.42 });
  const springY = useSpring(offsetY, { stiffness: 118, damping: 11, mass: 0.42 });

  const release = () => {
    setIsActive(false);
    offsetX.set(0);
    offsetY.set(0);
  };

  const followPointer = (event: PointerEvent<HTMLSpanElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    setIsActive(true);
    const bounds = event.currentTarget.getBoundingClientRect();
    const distanceX = event.clientX - (bounds.left + bounds.width / 2);
    const distanceY = event.clientY - (bounds.top + bounds.height / 2);
    const magneticX = Math.max(-30, Math.min(30, distanceX * 0.32));
    const magneticY = Math.max(-18, Math.min(18, distanceY * 0.42));
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;

    event.currentTarget.style.setProperty("--magnetic-x", `${pointerX}%`);
    event.currentTarget.style.setProperty("--magnetic-y", `${pointerY}%`);
    offsetX.set(magneticX);
    offsetY.set(magneticY);
  };

  return (
    <motion.span
      className={styles.technologyItem}
      style={reducedMotion ? undefined : { x: springX, y: springY }}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1, scale: !reducedMotion && isActive ? 1.075 : 1 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: 0.38, delay: index * 0.04 }}
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

export function ProjectPageView({ project }: { project: PublicProject }) {
  const shouldReduceMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const shortDescription =
    project.shortDescription ??
    "Una solución digital diseñada con intención, claridad y atención al detalle.";
  const longDescription = project.longDescription?.trim() ?? "";
  const hasExtendedDescription =
    longDescription.length > 0 && longDescription !== shortDescription.trim();
  const technologies = [...project.technologies].sort(
    (first, second) =>
      first.portfolioOrder - second.portfolioOrder ||
      first.name.localeCompare(second.name),
  );
  const images = [...project.images].sort(
    (first, second) => first.displayOrder - second.displayOrder,
  );

  return (
    <main className={styles.detailPage}>
      <div className={styles.detailFrame} aria-hidden="true">
        <span className={`${styles.detailCorner} ${styles.detailCornerTl}`} />
        <span className={`${styles.detailCorner} ${styles.detailCornerTr}`} />
        <span className={`${styles.detailCorner} ${styles.detailCornerBl}`} />
        <span className={`${styles.detailCorner} ${styles.detailCornerBr}`} />
      </div>

      <motion.section
        className={styles.detailHero}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <RouteTransitionLink href="/projects" className={styles.backLink}>
          <FiArrowLeft aria-hidden="true" />
          Volver a proyectos
        </RouteTransitionLink>

        <div className={styles.detailEyebrow}>
          <span>{project.category?.name ?? "Proyecto digital"}</span>
          <span>{formatDate(project.publishedAt)}</span>
        </div>

        <div className={styles.detailTitleRow}>
          <MagneticTitle as="h1" text={project.title} />
          <span aria-hidden="true">CASE<br />STUDY</span>
        </div>

        <div className={styles.detailIntro}>
          <div className={styles.detailDescription}>
            <p>{shortDescription}</p>
            {hasExtendedDescription && (
              <>
                <button
                  type="button"
                  className={styles.readMoreButton}
                  aria-expanded={isExpanded}
                  aria-controls="project-extended-description"
                  onClick={() => setIsExpanded((current) => !current)}
                  data-cursor="action"
                >
                  {isExpanded ? "Leer menos" : "Leer más"}
                  <FiChevronDown aria-hidden="true" />
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id="project-extended-description"
                      className={styles.extendedDescription}
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.36, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p>{longDescription}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          <div className={styles.detailActions}>
            {project.liveUrl && (
              <ProjectAction
                href={project.liveUrl}
                label="Ver proyecto"
                detail="Abrir sitio"
                Icon={FiExternalLink}
              />
            )}
            {project.repositoryUrl && (
              <ProjectAction
                href={project.repositoryUrl}
                label="Repositorio"
                detail="Explorar código"
                Icon={FiGithub}
              />
            )}
          </div>
        </div>
      </motion.section>

      <section className={styles.detailBody} aria-labelledby="technology-title">
        <div className={styles.detailLabel}>
          <span>01</span>
          <span id="technology-title">Tecnologías</span>
        </div>
        <div className={styles.technologyGrid}>
          {technologies.length > 0 ? (
            technologies.map((technology, index) => (
              <MagneticTechnology
                key={technology.id}
                technology={technology}
                index={index}
                reducedMotion={Boolean(shouldReduceMotion)}
              />
            ))
          ) : (
            <p className={styles.emptyTechnology}>Stack no publicado</p>
          )}
        </div>
      </section>

      <section className={styles.detailGallery} aria-labelledby="gallery-title">
        <div className={styles.detailGalleryHeading}>
          <div className={styles.detailLabel}>
            <span>02</span>
            <span id="gallery-title">Galería</span>
          </div>
          <p>Selecciona una imagen para verla con mayor detalle.</p>
        </div>

        {images.length > 0 ? (
          <div className={styles.detailGalleryGrid}>
            {images.map((image, index) => (
              <button
                type="button"
                key={image.id}
                onClick={() => setGalleryIndex(index)}
                aria-label={`Ampliar imagen ${index + 1}`}
                data-cursor="action"
              >
                <img
                  src={image.url}
                  alt={image.altText ?? `${project.title}, imagen ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                />
                <span>
                  <span>{image.title ?? `Vista ${String(index + 1).padStart(2, "0")}`}</span>
                  <FiArrowUpRight aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className={styles.galleryEmpty}>Este proyecto todavía no tiene imágenes publicadas.</p>
        )}
      </section>

      <footer className={styles.detailFooter}>
        <RouteTransitionLink href="/projects" className={styles.backLink}>
          <FiArrowLeft aria-hidden="true" />
          Volver a proyectos
        </RouteTransitionLink>
      </footer>

      <AnimatePresence>
        {galleryIndex !== null && (
          <GalleryLightbox
            images={images}
            projectTitle={project.title}
            initialIndex={galleryIndex}
            onClose={() => setGalleryIndex(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
