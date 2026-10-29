import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";

import { LOCALES, hasLocale, localePath, type Locale } from "../../../../../lib/i18n/config";
import { getDictionary, type Dictionary } from "../../../../../lib/i18n/dictionaries";
import { getProjectDetail, getProjectSlugs, type FeaturedProject } from "../../../../../lib/projects";
import { BrushStrokes } from "../../../brush-strokes";
import { CONTACT_EMAIL } from "../../../site-data";
import { SiteHeader } from "../../../site-header";
import styles from "../projects.module.css";

export const revalidate = 60;

type Params = { lang: string; slug: string };

/* Una página por proyecto publicado y por idioma. */
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return LOCALES.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);

  const detail = await getProjectDetail(slug, lang);
  if (!detail) return { title: dict.meta.projectNotFound };

  return {
    title: `${detail.name} — Amilcar Xicay`,
    description: detail.project.summary,
    alternates: { languages: { es: `/es/projects/${slug}`, en: `/en/projects/${slug}` } },
  };
}

const BRUSHES = [
  { brush: 9, className: styles.brushTopRight },
  { brush: 8, className: styles.brushLeft },
  { brush: 7, className: styles.brushBottomRight },
] as const;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

/* Un bloque del caso de estudio: índice a la izquierda y contenido a la derecha. */
function Section({ children, id, index, title }: { children: React.ReactNode; id: string; index: string; title: string }) {
  return (
    <section aria-labelledby={id} className={styles.section}>
      <header className={styles.sectionLabel}>
        <p>{index}</p>
        <h2 id={id}>{title}</h2>
      </header>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

function Neighbor({
  dict,
  direction,
  lang,
  project,
}: {
  dict: Dictionary;
  direction: "previous" | "next";
  lang: Locale;
  project: FeaturedProject;
}) {
  return (
    <Link
      className={`${styles.neighbor} ${direction === "next" ? styles.neighborNext : ""}`}
      href={localePath(lang, `/projects/${project.slug}`)}
    >
      <span>{direction === "previous" ? dict.detail.previous : dict.detail.next}</span>
      <strong>{project.name}</strong>
    </Link>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const detail = await getProjectDetail(slug, lang);
  if (!detail) notFound();

  const { project, name, cover, gallery, previous, next } = detail;
  const technologies = (project.technologies ?? []).map((tech) => tech.name);
  const features = project.features ?? [];
  const decisions = project.decisions ?? [];
  const results = project.results ?? [];

  /* Los bloques se numeran solo si existen, para que no haya saltos en el índice. */
  let counter = 0;
  const nextIndex = () => String(++counter).padStart(2, "0");

  return (
    <div className={styles.page}>
      <BrushStrokes className={styles.brushes} items={BRUSHES} />
      <SiteHeader current="projects" dict={dict} lang={lang} />

      <main className={styles.main} id="contenido">
        <Link className={styles.back} href={localePath(lang, "/projects")}>
          {dict.detail.back}
        </Link>

        <p className={styles.eyebrow}>
          {dict.detail.eyebrow}
          {project.category && <> · {project.category}</>}
          {project.year && <> · {project.year}</>}
        </p>
        <h1 className={styles.caseTitle}>{name}</h1>
        <p className={styles.lead}>{project.summary}</p>

        {cover && (
          <figure className={styles.cover}>
            <Image alt={cover.alt} className={styles.coverImage} height={cover.height} priority sizes="(max-width: 1200px) 94vw, 1100px" src={cover.url} width={cover.width} />
          </figure>
        )}

        <dl className={styles.facts}>
          {project.role && (
            <div>
              <dt>{dict.detail.role}</dt>
              <dd>{project.role}</dd>
            </div>
          )}
          {project.year && (
            <div>
              <dt>{dict.detail.year}</dt>
              <dd>{project.year}</dd>
            </div>
          )}
          {project.category && (
            <div>
              <dt>{dict.detail.type}</dt>
              <dd>{project.category}</dd>
            </div>
          )}
          {technologies.length > 0 && (
            <div>
              <dt>{dict.detail.technologies}</dt>
              <dd>
                <ul className={styles.pills}>
                  {technologies.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>

        {(project.demoUrl || project.repositoryUrl) && (
          <div className={styles.actions}>
            {project.demoUrl && (
              <a className={styles.actionPrimary} href={project.demoUrl} rel="noreferrer noopener" target="_blank">
                {dict.detail.demo} <ArrowIcon />
              </a>
            )}
            {project.repositoryUrl && (
              <a className={styles.actionSecondary} href={project.repositoryUrl} rel="noreferrer noopener" target="_blank">
                {dict.detail.repository} <ArrowIcon />
              </a>
            )}
          </div>
        )}

        {project.problem && (
          <Section id="problema" index={nextIndex()} title={dict.detail.problem}>
            <div className={styles.prose}>
              <RichText data={project.problem} />
            </div>
          </Section>
        )}

        {project.solution && (
          <Section id="solucion" index={nextIndex()} title={dict.detail.solution}>
            <div className={styles.prose}>
              <RichText data={project.solution} />
            </div>
          </Section>
        )}

        {features.length > 0 && (
          <Section id="funciones" index={nextIndex()} title={dict.detail.features}>
            <ul className={styles.cards}>
              {features.map((feature, index) => (
                <li className={styles.infoCard} key={feature.id ?? index}>
                  <h3>{feature.title}</h3>
                  {feature.description && <p>{feature.description}</p>}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {(project.architecture || decisions.length > 0) && (
          <Section id="arquitectura" index={nextIndex()} title={dict.detail.architecture}>
            {project.architecture && (
              <div className={styles.prose}>
                <RichText data={project.architecture} />
              </div>
            )}
            {decisions.length > 0 && (
              <ul className={styles.cards}>
                {decisions.map((item, index) => (
                  <li className={styles.infoCard} key={item.id ?? index}>
                    <h3>{item.decision}</h3>
                    <p>{item.reason}</p>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}

        {gallery.length > 0 && (
          <Section id="galeria" index={nextIndex()} title={dict.detail.gallery}>
            <ul className={styles.gallery}>
              {gallery.map((item) => (
                <li key={item.url}>
                  <figure>
                    <Image alt={item.alt} height={item.height} sizes="(max-width: 768px) 92vw, 45vw" src={item.url} width={item.width} />
                    {item.caption && <figcaption>{item.caption}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {results.length > 0 && (
          <Section id="resultados" index={nextIndex()} title={dict.detail.results}>
            <ul className={styles.cards}>
              {results.map((item, index) => (
                <li className={styles.infoCard} key={item.id ?? index}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {project.content && (
          <Section id="mas" index={nextIndex()} title={dict.detail.more}>
            <div className={styles.prose}>
              <RichText data={project.content} />
            </div>
          </Section>
        )}

        {(previous || next) && (
          <nav aria-label={dict.detail.others} className={styles.neighbors}>
            {previous ? <Neighbor dict={dict} direction="previous" lang={lang} project={previous} /> : <span />}
            {next ? <Neighbor dict={dict} direction="next" lang={lang} project={next} /> : <span />}
          </nav>
        )}

        <div className={styles.cta}>
          <a className={styles.ctaStrip} href={`mailto:${CONTACT_EMAIL}`}>
            <span>{dict.list.ctaQuestion}</span>
            <strong>
              {dict.list.ctaAction}
              <ArrowIcon />
            </strong>
          </a>
        </div>
      </main>
    </div>
  );
}
