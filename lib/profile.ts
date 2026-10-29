import "server-only";

import { getPayload } from "payload";
import config from "@payload-config";

import type { Media, Profile } from "../payload-types";
import { DEFAULT_LOCALE, type Locale } from "./i18n/config";

export type ProfileData = {
  name: string;
  title: string;
  headline: string | null;
  /* Frase destacada de «Sobre mí» (null si no se cargó en Payload). */
  quote: string | null;
  location: string | null;
  email: string | null;
  /* Texto enriquecido «Sobre mí» tal como lo guarda Payload (null si está vacío). */
  about: Profile["about"] | null;
  photo: { url: string; alt: string; width: number; height: number } | null;
};

/* Perfil del global de Payload. Si falla la conexión devuelve null y el inicio sigue cargando. */
export async function getProfile(locale: Locale): Promise<ProfileData | null> {
  try {
    const payload = await getPayload({ config });
    const profile = await payload.findGlobal({
      slug: "profile",
      depth: 1,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
      overrideAccess: false,
    });

    const media =
      typeof profile.profileImage === "object" && profile.profileImage ? (profile.profileImage as Media) : null;

    return {
      name: profile.name,
      title: profile.professionalTitle,
      headline: profile.headline || null,
      quote: profile.quote || null,
      location: profile.location || null,
      email: profile.contactEmail || null,
      about: profile.about ?? null,
      photo: media?.url
        ? { url: media.url, alt: media.alt, width: media.width ?? 800, height: media.height ?? 1000 }
        : null,
    };
  } catch (error) {
    console.error("No se pudo cargar el perfil:", error);
    return null;
  }
}
