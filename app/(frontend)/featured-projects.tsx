import Image from "next/image";
import Link from "next/link";

import { localePath, type Locale } from "../../lib/i18n/config";
import { format, type Dictionary } from "../../lib/i18n/dictionaries";
import type { FeaturedProject } from "../../lib/projects";
import { BrushStrokes } from "./brush-strokes";
import { Reveal } from "./home-motion";
import styles from "./home-landing.module.css";

const PROJECT_BRUSHES = [
  { brush: 3, className: styles.projectBrush1 },
  { brush: 1, className: styles.projectBrush2 },
  { brush: 5, className: styles.projectBrush3 },
  { brush: 6, className: styles.projectBrush4 },
] as const;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

type SectionProps = { dict: Dictionary; lang: Locale };

function ProjectCard({ dict, index, lang, project }: SectionProps & { index: number; project: FeaturedProject }) {
  const isMain = index === 0;
  const number = String(index + 1).padStart(2, "0");
  const cardClass = [styles.card, isMain ? styles.cardMain : styles.cardSide, styles[`card${index + 1}`]].join(" ");

  return (
    <Reveal className={cardClass} kind="rise" delay={index * 0.08} onView>
      <article className={styles.cardInner}>
        <span aria-hidden="true" className={styles.cardTab}>
          {number}
        </span>

        <div className={styles.cardMedia}>
          {project.image && (
            <Image
              alt={project.image.alt}
              className={styles.cardImage}
              fill
              sizes={isMain ? "(max-width: 896px) 90vw, 55vw" : "(max-width: 896px) 90vw, 30vw"}
              src={project.image.url}
            />
          )}
        </div>

        <div className={styles.cardBody}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardName}>{project.name}</h3>
            <p className={styles.cardMeta}>
              {project.year && <span>{project.year}</span>}
              {project.category && <span>{project.category}</span>}
            </p>
          </div>

          <p className={styles.cardSummary}>{project.summary}</p>

          <div className={styles.cardFoot}>
            <ul aria-label={format(dict.common.technologiesOf, { name: project.name })} className={styles.pills}>
              {project.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <Link className={styles.cardLink} href={localePath(lang, `/projects/${project.slug}`)}>
              {dict.common.viewCase} <ArrowIcon />
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* Sección de proyectos destacados: los marcados como «destacado» en Payload. */
export function FeaturedProjects({ dict, lang, projects }: SectionProps & { projects: FeaturedProject[] }) {
  if (!projects.length) return null;

  return (
    <section aria-labelledby="proyectos-titulo" className={styles.projects} id="proyectos">
      <BrushStrokes className={styles.projectBrushes} items={PROJECT_BRUSHES} />

      <div className={styles.projectsInner}>
        <Reveal kind="rise" onView>
          <h2 className={styles.projectsTitle} id="proyectos-titulo">
            {dict.featured.title}
          </h2>
        </Reveal>

        <div className={styles.projectGrid}>
          <div className={styles.projectMainCol}>
            <ProjectCard dict={dict} index={0} lang={lang} project={projects[0]} />

            <Reveal className={styles.allProjectsWrap} kind="rise" onView>
              <Link className={styles.allProjects} href={localePath(lang, "/projects")}>
                {dict.featured.all} <ArrowIcon />
              </Link>
            </Reveal>
          </div>

          {projects.length > 1 && (
            <div className={styles.projectSideCol}>
              {projects.slice(1).map((project, index) => (
                <ProjectCard dict={dict} index={index + 1} key={project.id} lang={lang} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
