import "server-only";

import { getPayload } from "payload";
import config from "@payload-config";

import type { Media, Project } from "../payload-types";
import { DEFAULT_LOCALE, type Locale } from "./i18n/config";

/** Ejemplo de lectura segura desde un Server Component de Next.js. */
export async function getPublishedProjects() {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "projects",
    where: {
      status: { equals: "published" },
    },
    limit: 20,
    depth: 0,
    overrideAccess: false,
  });

  return result.docs;
}

export type ProjectImage = { url: string; alt: string; width: number; height: number };

/* Datos mínimos para pintar una tarjeta de proyecto (inicio y lista). */
export type FeaturedProject = {
  id: string;
  slug: string;
  /* Nombre corto: lo que va antes de « — » en el título. */
  name: string;
  summary: string;
  category: string | null;
  role: string | null;
  year: number | null;
  technologies: string[];
  image: ProjectImage | null;
};

const shortName = (title: string) => title.split(" — ")[0].trim();

function toImage(value: unknown): ProjectImage | null {
  if (!value || typeof value !== "object") return null;
  const media = value as Media;
  if (!media.url) return null;
  return { url: media.url, alt: media.alt, width: media.width ?? 1200, height: media.height ?? 800 };
}

function toCard(project: Project): FeaturedProject {
  return {
    id: String(project.id),
    slug: project.slug,
    name: shortName(project.title),
    summary: project.summary,
    category: project.category ?? null,
    role: project.role ?? null,
    year: project.year ?? null,
    technologies: (project.technologies ?? []).map((tech) => tech.name),
    image: toImage(project.cardImage),
  };
}

/* Destacados primero (por su orden) y después el resto, del año más reciente al más antiguo. */
const byRelevance = (a: Project, b: Project) => {
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
  if (a.featured && b.featured) return (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity);
  return (b.year ?? 0) - (a.year ?? 0);
};

/**
 * Proyectos publicados y marcados como destacados en Payload, ordenados por
 * «Orden en destacados» (los que no tienen orden van al final). Si falla la
 * conexión devuelve una lista vacía para que el inicio siga cargando.
 */
export async function getFeaturedProjects(locale: Locale, limit = 3): Promise<FeaturedProject[]> {
  try {
    const payload = await getPayload({ config });

    const result = await payload.find({
      collection: "projects",
      where: {
        and: [{ status: { equals: "published" } }, { featured: { equals: true } }],
      },
      limit: 20,
      depth: 1,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
      overrideAccess: false,
    });

    return result.docs
      .sort((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity))
      .slice(0, limit)
      .map(toCard);
  } catch (error) {
    console.error("No se pudieron cargar los proyectos destacados:", error);
    return [];
  }
}

/* Todos los proyectos publicados para la página /projects. */
export async function getAllProjectCards(locale: Locale): Promise<FeaturedProject[]> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "projects",
      where: { status: { equals: "published" } },
      limit: 100,
      depth: 1,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
      overrideAccess: false,
    });
    return result.docs.sort(byRelevance).map(toCard);
  } catch (error) {
    console.error("No se pudieron cargar los proyectos:", error);
    return [];
  }
}

/* Slugs publicados, para generar las páginas de detalle. */
export async function getProjectSlugs(): Promise<string[]> {
  return (await getAllProjectCards(DEFAULT_LOCALE)).map((project) => project.slug);
}

export type ProjectDetail = {
  project: Project;
  name: string;
  cover: ProjectImage | null;
  gallery: (ProjectImage & { caption: string | null })[];
  previous: FeaturedProject | null;
  next: FeaturedProject | null;
};

/* Caso de estudio completo con el proyecto anterior y el siguiente de la lista. */
export async function getProjectDetail(slug: string, locale: Locale): Promise<ProjectDetail | null> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "projects",
      where: { and: [{ slug: { equals: slug } }, { status: { equals: "published" } }] },
      limit: 1,
      depth: 1,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
      overrideAccess: false,
    });

    const project = result.docs[0];
    if (!project) return null;

    const all = await getAllProjectCards(locale);
    const position = all.findIndex((item) => item.slug === slug);

    const gallery = (project.gallery ?? []).flatMap((item) => {
      const image = toImage(item.image);
      return image ? [{ ...image, alt: item.alt || image.alt, caption: item.caption ?? null }] : [];
    });

    return {
      project,
      name: shortName(project.title),
      cover: toImage(project.cardImage),
      gallery,
      previous: position > 0 ? all[position - 1] : null,
      next: position >= 0 && position < all.length - 1 ? all[position + 1] : null,
    };
  } catch (error) {
    console.error("No se pudo cargar el proyecto:", error);
    return null;
  }
}
