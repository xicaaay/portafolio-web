/* Idiomas de la web. El español es el principal; el inglés se elige con el selector. */
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/* Cookie donde se recuerda el idioma elegido. */
export const LOCALE_COOKIE = "lang";

export const hasLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/* Ruta con idioma: localePath("en", "/projects") → "/en/projects"; localePath("es") → "/es". */
export const localePath = (locale: Locale, path = "/") => `/${locale}${path === "/" ? "" : path}`;

/* Valor de `hreflang` / `<html lang>` y nombre para mostrar de cada idioma. */
export const LOCALE_LABELS: Record<Locale, { short: string; name: string }> = {
  es: { short: "ES", name: "Español" },
  en: { short: "EN", name: "English" },
};
