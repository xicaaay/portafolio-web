import type {
  ProfileLoadResult,
  PublicProfile,
  PublicSocialLink,
} from "./about-me.types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function readHttpUrl(value: unknown): string | null {
  const candidate = readText(value);
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function readEmail(value: unknown): string | null {
  const candidate = readText(value);
  if (!candidate) return null;

  const isUsableEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate);
  return isUsableEmail ? candidate : null;
}

function readOrder(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function parseSocialLink(
  value: unknown,
  fallbackOrder: number,
): PublicSocialLink | null {
  if (!isRecord(value)) return null;
  if (value.showInPortfolio !== true || value.isActive !== true) return null;

  const url = readHttpUrl(value.url);
  const platform = readText(value.platform);
  const label = readText(value.label) ?? platform;

  if (!url || !platform || !label) return null;

  return {
    key: readText(value.key) ?? `${platform}-${fallbackOrder}`,
    platform,
    label,
    url,
    username: readText(value.username),
    iconLibrary: readText(value.iconLibrary),
    iconKey: readText(value.iconKey),
    displayOrder: readOrder(value.displayOrder, fallbackOrder),
  };
}

function parseProfile(value: unknown): PublicProfile | null {
  if (!isRecord(value)) return null;

  const socialLinks = Array.isArray(value.socialLinks)
    ? value.socialLinks
        .map(parseSocialLink)
        .filter((link): link is PublicSocialLink => link !== null)
        .sort((first, second) => first.displayOrder - second.displayOrder)
    : [];

  return {
    publicName: readText(value.publicName),
    headline: readText(value.headline),
    shortBio: readText(value.shortBio),
    longBio:
      readText(value.longBio) ??
      readText(value.longDescription) ??
      readText(value.description),
    profileImageUrl: readHttpUrl(value.profileImageUrl),
    resumeUrl: readHttpUrl(value.resumeUrl),
    publicEmail: readEmail(value.publicEmail),
    socialLinks,
  };
}

function hasVisibleContent(profile: PublicProfile): boolean {
  return Boolean(
    profile.publicName ||
      profile.headline ||
      profile.shortBio ||
      profile.longBio ||
      profile.profileImageUrl ||
      profile.resumeUrl ||
      profile.publicEmail ||
      profile.socialLinks.length > 0,
  );
}

function buildProfileEndpoint(): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!baseUrl) return null;

  try {
    return new URL(`${baseUrl.replace(/\/+$/, "")}/public/profile`).toString();
  } catch {
    return null;
  }
}

export async function getPublicProfile(): Promise<ProfileLoadResult> {
  const endpoint = buildProfileEndpoint();

  if (!endpoint) {
    return {
      status: "error",
      message: "El perfil no está disponible en este momento.",
    };
  }

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return {
        status: "error",
        message: "No fue posible obtener la información del perfil.",
      };
    }

    const payload: unknown = await response.json();

    if (!isRecord(payload) || payload.success !== true) {
      return {
        status: "error",
        message: "La API no devolvió un perfil disponible.",
      };
    }

    const profile = parseProfile(payload.data);

    if (!profile || !hasVisibleContent(profile)) {
      return { status: "empty" };
    }

    return { status: "success", profile };
  } catch {
    return {
      status: "error",
      message: "No se pudo conectar con el servicio del perfil.",
    };
  }
}
