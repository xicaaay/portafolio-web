export type PublicTechnology = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  iconLibrary: string | null;
  iconKey: string | null;
  brandColor: string | null;
  portfolioOrder: number;
};

export type PublicProjectCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type PublicProjectImage = {
  id: string;
  url: string;
  altText: string | null;
  title: string | null;
  displayOrder: number;
  isPrimary: boolean;
  width: number | null;
  height: number | null;
};

export type PublicProject = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  longDescription: string | null;
  displayOrder: number;
  isFeatured: boolean;
  publishedAt: string | null;
  liveUrl: string | null;
  repositoryUrl: string | null;
  category: PublicProjectCategory | null;
  technologies: PublicTechnology[];
  images: PublicProjectImage[];
};

export type PublicExperienceResponsibility = {
  id: string;
  description: string;
  displayOrder: number;
};

export type PublicExperience = {
  id: string;
  positionTitle: string;
  organizationName: string;
  organizationUrl: string | null;
  organizationLogoUrl: string | null;
  location: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  displayOrder: number;
  technologies: PublicTechnology[];
  responsibilities: PublicExperienceResponsibility[];
};

export type ProjectListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PublicApiLoadResult<T> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "empty";
    }
  | {
      status: "error";
      message: string;
    };

export type PublicProjectsLoadResult = PublicApiLoadResult<{
  projects: PublicProject[];
  meta: ProjectListMeta;
  apiBaseUrl: string;
}>;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function readBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
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

function readDate(value: unknown): string | null {
  const candidate = readText(value);
  if (!candidate) return null;

  const timestamp = Date.parse(candidate);
  return Number.isNaN(timestamp) ? null : candidate;
}

export function getPublicApiBaseUrl(): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!baseUrl) return null;

  try {
    return new URL(baseUrl.replace(/\/+$/, "")).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function buildPublicApiEndpoint(path: string): string | null {
  const baseUrl = getPublicApiBaseUrl();
  if (!baseUrl) return null;

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function resolvePublicAssetUrl(
  value: unknown,
  apiBaseUrl = getPublicApiBaseUrl(),
): string | null {
  const candidate = readText(value);
  if (!candidate) return null;

  const directUrl = readHttpUrl(candidate);
  if (directUrl) return directUrl;
  if (!apiBaseUrl) return null;

  try {
    const base = new URL(apiBaseUrl);

    if (candidate.startsWith("/")) {
      return new URL(candidate, base.origin).toString();
    }

    return new URL(candidate, `${apiBaseUrl.replace(/\/+$/, "")}/`).toString();
  } catch {
    return null;
  }
}

function parseTechnology(value: unknown): PublicTechnology | null {
  if (!isRecord(value)) return null;

  const id = readText(value.id);
  const name = readText(value.name);
  const slug = readText(value.slug);
  const category = readText(value.category);

  if (!id || !name || !slug || !category) return null;

  return {
    id,
    name,
    slug,
    description: readText(value.description),
    category,
    iconLibrary: readText(value.iconLibrary),
    iconKey: readText(value.iconKey),
    brandColor: readText(value.brandColor),
    portfolioOrder: readNumber(value.portfolioOrder),
  };
}

function parseProjectCategory(value: unknown): PublicProjectCategory | null {
  if (!isRecord(value)) return null;

  const id = readText(value.id);
  const name = readText(value.name);
  const slug = readText(value.slug);

  if (!id || !name || !slug) return null;

  return {
    id,
    name,
    slug,
    description: readText(value.description),
  };
}

function parseProjectImage(
  value: unknown,
  apiBaseUrl: string | null,
): PublicProjectImage | null {
  if (!isRecord(value)) return null;

  const id = readText(value.id);
  const url = resolvePublicAssetUrl(value.url, apiBaseUrl);

  if (!id || !url) return null;

  return {
    id,
    url,
    altText: readText(value.altText),
    title: readText(value.title),
    displayOrder: readNumber(value.displayOrder),
    isPrimary: readBoolean(value.isPrimary),
    width: typeof value.width === "number" ? value.width : null,
    height: typeof value.height === "number" ? value.height : null,
  };
}

export function parsePublicProject(
  value: unknown,
  apiBaseUrl: string | null,
): PublicProject | null {
  if (!isRecord(value)) return null;

  const id = readText(value.id);
  const title = readText(value.title);
  const slug = readText(value.slug);

  if (!id || !title || !slug) return null;

  const technologies = Array.isArray(value.technologies)
    ? value.technologies
        .map((relation) => {
          if (!isRecord(relation)) return null;
          return parseTechnology(relation.technology);
        })
        .filter((technology): technology is PublicTechnology => technology !== null)
    : [];

  const images = Array.isArray(value.images)
    ? value.images
        .map((image) => parseProjectImage(image, apiBaseUrl))
        .filter((image): image is PublicProjectImage => image !== null)
        .sort((first, second) => {
          if (first.isPrimary !== second.isPrimary) return first.isPrimary ? -1 : 1;
          return first.displayOrder - second.displayOrder;
        })
    : [];

  return {
    id,
    title,
    slug,
    shortDescription: readText(value.shortDescription),
    longDescription: readText(value.longDescription),
    displayOrder: readNumber(value.displayOrder),
    isFeatured: readBoolean(value.isFeatured),
    publishedAt: readDate(value.publishedAt),
    liveUrl: readHttpUrl(value.liveUrl),
    repositoryUrl: readHttpUrl(value.repositoryUrl),
    category: parseProjectCategory(value.category),
    technologies,
    images,
  };
}

function parseExperienceResponsibility(
  value: unknown,
): PublicExperienceResponsibility | null {
  if (!isRecord(value)) return null;

  const id = readText(value.id);
  const description = readText(value.description);

  if (!id || !description) return null;

  return {
    id,
    description,
    displayOrder: readNumber(value.displayOrder),
  };
}

function parseExperience(
  value: unknown,
  apiBaseUrl: string | null,
): PublicExperience | null {
  if (!isRecord(value)) return null;

  const id = readText(value.id);
  const positionTitle = readText(value.positionTitle);
  const organizationName = readText(value.organizationName);
  const startDate = readDate(value.startDate);

  if (!id || !positionTitle || !organizationName || !startDate) return null;

  const technologies = Array.isArray(value.technologies)
    ? value.technologies
        .map((relation) => {
          if (!isRecord(relation)) return null;
          return parseTechnology(relation.technology);
        })
        .filter((technology): technology is PublicTechnology => technology !== null)
    : [];

  const responsibilities = Array.isArray(value.responsibilities)
    ? value.responsibilities
        .map(parseExperienceResponsibility)
        .filter(
          (
            responsibility,
          ): responsibility is PublicExperienceResponsibility =>
            responsibility !== null,
        )
        .sort((first, second) => first.displayOrder - second.displayOrder)
    : [];

  return {
    id,
    positionTitle,
    organizationName,
    organizationUrl: readHttpUrl(value.organizationUrl),
    organizationLogoUrl: resolvePublicAssetUrl(
      value.organizationLogoUrl,
      apiBaseUrl,
    ),
    location: readText(value.location),
    shortDescription: readText(value.shortDescription),
    longDescription: readText(value.longDescription),
    startDate,
    endDate: readDate(value.endDate),
    isCurrent: readBoolean(value.isCurrent),
    displayOrder: readNumber(value.displayOrder),
    technologies,
    responsibilities,
  };
}

async function requestPublicData(path: string): Promise<unknown> {
  const endpoint = buildPublicApiEndpoint(path);

  if (!endpoint) {
    throw new Error("La URL pública de la API no está configurada.");
  }

  const response = await fetch(endpoint, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`La API respondió con estado ${response.status}.`);
  }

  const payload: unknown = await response.json();

  if (!isRecord(payload) || payload.success !== true) {
    throw new Error("La API no devolvió una respuesta pública válida.");
  }

  return payload.data;
}

export async function getPublicProjects(): Promise<PublicProjectsLoadResult> {
  const apiBaseUrl = getPublicApiBaseUrl();

  if (!apiBaseUrl) {
    return {
      status: "error",
      message: "Los proyectos no están disponibles porque falta configurar NEXT_PUBLIC_API_URL.",
    };
  }

  try {
    const data = await requestPublicData("/public/projects?page=1&limit=100");

    if (!isRecord(data) || !Array.isArray(data.items)) {
      return {
        status: "error",
        message: "La API no devolvió un listado de proyectos válido.",
      };
    }

    const projects = data.items
      .map((project) => parsePublicProject(project, apiBaseUrl))
      .filter((project): project is PublicProject => project !== null);

    if (projects.length === 0) return { status: "empty" };

    const metaRecord = isRecord(data.meta) ? data.meta : {};
    const meta: ProjectListMeta = {
      page: readNumber(metaRecord.page, 1),
      limit: readNumber(metaRecord.limit, projects.length),
      total: readNumber(metaRecord.total, projects.length),
      totalPages: readNumber(metaRecord.totalPages, 1),
    };

    return {
      status: "success",
      data: {
        projects,
        meta,
        apiBaseUrl,
      },
    };
  } catch {
    return {
      status: "error",
      message: "No fue posible conectar con el servicio de proyectos.",
    };
  }
}

export async function getPublicProject(
  slug: string,
): Promise<PublicApiLoadResult<PublicProject>> {
  const apiBaseUrl = getPublicApiBaseUrl();

  if (!apiBaseUrl) {
    return {
      status: "error",
      message: "El proyecto no está disponible porque falta configurar NEXT_PUBLIC_API_URL.",
    };
  }

  try {
    const data = await requestPublicData(
      `/public/projects/${encodeURIComponent(slug)}`,
    );
    const project = parsePublicProject(data, apiBaseUrl);

    if (!project) {
      return {
        status: "error",
        message: "La API no devolvió un proyecto válido.",
      };
    }

    return { status: "success", data: project };
  } catch {
    return {
      status: "error",
      message: "No fue posible cargar el proyecto solicitado.",
    };
  }
}

export async function getPublicTechnologies(): Promise<
  PublicApiLoadResult<PublicTechnology[]>
> {
  try {
    const data = await requestPublicData("/public/technologies");

    if (!Array.isArray(data)) {
      return {
        status: "error",
        message: "La API no devolvió un listado de tecnologías válido.",
      };
    }

    const technologies = data
      .map(parseTechnology)
      .filter((technology): technology is PublicTechnology => technology !== null)
      .sort((first, second) => {
        if (first.portfolioOrder !== second.portfolioOrder) {
          return first.portfolioOrder - second.portfolioOrder;
        }

        return first.name.localeCompare(second.name, "es");
      });

    return technologies.length > 0
      ? { status: "success", data: technologies }
      : { status: "empty" };
  } catch {
    return {
      status: "error",
      message: "No fue posible conectar con el servicio de tecnologías.",
    };
  }
}

export async function getPublicExperiences(): Promise<
  PublicApiLoadResult<PublicExperience[]>
> {
  const apiBaseUrl = getPublicApiBaseUrl();

  try {
    const data = await requestPublicData("/public/experiences");

    if (!Array.isArray(data)) {
      return {
        status: "error",
        message: "La API no devolvió un listado de experiencia válido.",
      };
    }

    const experiences = data
      .map((experience) => parseExperience(experience, apiBaseUrl))
      .filter((experience): experience is PublicExperience => experience !== null)
      .sort((first, second) => {
        if (first.displayOrder !== second.displayOrder) {
          return first.displayOrder - second.displayOrder;
        }

        return Date.parse(second.startDate) - Date.parse(first.startDate);
      });

    return experiences.length > 0
      ? { status: "success", data: experiences }
      : { status: "empty" };
  } catch {
    return {
      status: "error",
      message: "No fue posible conectar con el servicio de experiencia.",
    };
  }
}
