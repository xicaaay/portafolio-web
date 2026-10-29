import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { hasLocale } from "../../../../lib/i18n/config";
import { format, getDictionary } from "../../../../lib/i18n/dictionaries";
import { getAllProjectCards } from "../../../../lib/projects";
import { BrushStrokes } from "../../brush-strokes";
import { CONTACT_EMAIL } from "../../site-data";
import { SiteHeader } from "../../site-header";
import { ProjectsBrowser } from "./projects-browser";
import styles from "./projects.module.css";

export const revalidate = 60;

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    title: dict.meta.projectsTitle,
    description: dict.meta.projectsDescription,
    alternates: { languages: { es: "/es/projects", en: "/en/projects" } },
  };
}

const BRUSHES = [
  { brush: 8, className: styles.brushLeft },
  { brush: 7, className: styles.brushBottomRight },
  { brush: 9, className: styles.brushTopRight },
  { brush: 8, className: styles.brushBottomLeft },
] as const;

export default async function ProjectsPage({ params }: PageParams) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const projects = await getAllProjectCards(lang);
  const years = projects.flatMap((project) => (project.year ? [project.year] : []));
  const range = years.length ? `${Math.min(...years)}—${Math.max(...years)}` : null;

  return (
    <div className={styles.page}>
      <BrushStrokes className={styles.brushes} items={BRUSHES} />
      <SiteHeader current="projects" dict={dict} lang={lang} />

      <main className={styles.main} id="contenido">
        <div className={styles.heroTitle}>
          <h1 className={styles.titleStrip}>{dict.list.title}</h1>
          {range && <p className={styles.subtitleStrip}>{format(dict.list.selection, { range })}</p>}
        </div>

        {projects.length ? (
          <ProjectsBrowser dict={dict} lang={lang} projects={projects} />
        ) : (
          <p className={styles.empty}>{dict.list.empty}</p>
        )}

        <div className={styles.cta}>
          <a className={styles.ctaStrip} href={`mailto:${CONTACT_EMAIL}`}>
            <span>{dict.list.ctaQuestion}</span>
            <strong>
              {dict.list.ctaAction}
              <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </strong>
          </a>
        </div>
      </main>
    </div>
  );
}
