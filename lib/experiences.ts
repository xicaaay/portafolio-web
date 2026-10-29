import "server-only";

import { getPayload } from "payload";
import config from "@payload-config";

import type { Dictionary } from "./i18n/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "./i18n/config";

export type ExperienceItem = {
  id: string;
  position: string;
  company: string;
  location: string | null;
  employmentType: string | null;
  /* «ene 2024 — Actualidad» */
  period: string;
  summary: string | null;
  achievements: string[];
  technologies: string[];
};

/* Mes abreviado y año en español, leyendo la fecha en UTC para que no cambie por zona horaria. */
const monthYear = (value: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(value))
    .replace(".", "");

/*
 * Experiencias publicadas en Payload: primero por «Orden de visualización» (las que no
 * lo tienen van después) y luego de la más reciente a la más antigua. Si falla la conexión
 * devuelve una lista vacía para que el inicio siga cargando.
 */
export async function getExperiences(locale: Locale, labels: Dictionary["career"]): Promise<ExperienceItem[]> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "experiences",
      where: { status: { equals: "published" } },
      limit: 50,
      depth: 0,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
      overrideAccess: false,
    });

    return result.docs
      .sort((a, b) => {
        const order = (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity);
        if (order !== 0 && Number.isFinite(order)) return order;
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      })
      .map((item) => ({
        id: String(item.id),
        position: item.position,
        company: item.company,
        location: item.location || null,
        employmentType: item.employmentType ? labels.employment[item.employmentType] : null,
        period: `${monthYear(item.startDate, locale)} — ${
          item.current || !item.endDate ? labels.present : monthYear(item.endDate, locale)
        }`,
        summary: item.summary || null,
        achievements: (item.achievements ?? []).map((achievement) => achievement.description),
        technologies: (item.technologies ?? []).map((tech) => tech.name),
      }));
  } catch (error) {
    console.error("No se pudieron cargar las experiencias:", error);
    return [];
  }
}
