import { es } from "./es";
import { en } from "./en";
import type { Locale } from "./config";

/* Convierte los textos literales de es.ts en `string`, para que en.ts pueda decir otra cosa con la misma forma. */
type Widen<T> = T extends string ? string : T extends readonly (infer U)[] ? Widen<U>[] : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof es>;

const dictionaries: Record<Locale, Dictionary> = { es, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

/* Sustituye {marcadores}: format("Hola {name}", { name: "Ana" }) → "Hola Ana". */
export const format = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
