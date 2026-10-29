"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { localePath, type Locale } from "../../../../lib/i18n/config";
import { format, type Dictionary } from "../../../../lib/i18n/dictionaries";
import type { FeaturedProject } from "../../../../lib/projects";
import styles from "./projects.module.css";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

/* Filtros por categoría (las que existan en Payload) y retícula editorial de tarjetas. */
export function ProjectsBrowser({ dict, lang, projects }: { dict: Dictionary; lang: Locale; projects: FeaturedProject[] }) {
  /* null = «Todos». Se guarda la categoría tal cual viene de Payload. */
  const [active, setActive] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(projects.map((project) => project.category).filter((c): c is string => Boolean(c)))),
    [projects],
  );

  const visible = active === null ? projects : projects.filter((project) => project.category === active);

  return (
    <>
      {categories.length > 1 && (
        <div aria-label={dict.list.filterLabel} className={styles.filters} role="group">
          {[null, ...categories].map((category) => (
            <button
              aria-pressed={category === active}
              className={styles.chip}
              key={category ?? "all"}
              onClick={() => setActive(category)}
              type="button"
            >
              {category ?? dict.list.all}
            </button>
          ))}
        </div>
      )}

      <p aria-live="polite" className={styles.count}>
        {visible.length} {visible.length === 1 ? dict.list.countOne : dict.list.countMany}
      </p>

      <ul className={styles.grid}>
        {visible.map((project, index) => (
          <li className={index === 0 ? styles.gridWide : styles.gridItem} key={project.id}>
            <article className={styles.card}>
              <div className={styles.cardMedia}>
                <span aria-hidden="true" className={styles.cardIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {project.image && (
                  <Image
                    alt={project.image.alt}
                    className={styles.cardImage}
                    fill
                    sizes={index === 0 ? "(max-width: 768px) 92vw, 50vw" : "(max-width: 768px) 92vw, 33vw"}
                    src={project.image.url}
                  />
                )}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardHead}>
                  <h2 className={styles.cardName}>{project.name}</h2>
                  <p className={styles.cardMeta}>
                    {project.year && <span>{project.year}</span>}
                    {project.category && <span>{project.category}</span>}
                  </p>
                </div>

                <p className={styles.cardSummary}>{project.summary}</p>

                <div className={styles.cardFoot}>
                  <ul aria-label={format(dict.common.technologiesOf, { name: project.name })} className={styles.pills}>
                    {project.technologies.slice(0, 4).map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  <Link className={styles.cardLink} href={localePath(lang, `/projects/${project.slug}`)}>
                    <span className={styles.srOnly}>{format(dict.common.viewCaseOf, { name: project.name })}</span>
                    <span aria-hidden="true">{dict.common.viewCase}</span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
