import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { getPayload } from "payload";

import config from "./payload.config";

const databaseURL = process.env.DATABASE_URL;
const allowRemote = process.argv.includes("--allow-remote");

if (!databaseURL) {
  throw new Error("DATABASE_URL no está definido. No se insertaron datos.");
}

const databaseHost = new URL(databaseURL).hostname;
const isLocalDatabase = ["localhost", "127.0.0.1", "::1"].includes(databaseHost);

if (!isLocalDatabase && !allowRemote) {
  throw new Error(
    "La seed solo corre contra localhost por seguridad. Para una base remota usa explícitamente: npm run seed -- --allow-remote",
  );
}

const lexicalText = (paragraphs: string[]) => ({
  root: {
    type: "root",
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    version: 1,
    children: paragraphs.map((text) => ({
      type: "paragraph",
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "text",
          text,
          detail: 0,
          format: 0,
          mode: "normal",
          style: "",
          version: 1,
        },
      ],
    })),
  },
});

const fakeImageSvg = (background: string, accent: string, title: string) =>
  `<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${background}"/><stop offset="1" stop-color="#121926"/></linearGradient></defs>
    <rect width="1200" height="800" fill="url(#g)"/>
    <circle cx="920" cy="210" r="260" fill="${accent}" opacity=".55"/>
    <rect x="105" y="112" width="990" height="576" rx="34" fill="#10151f" opacity=".82" stroke="#ffffff" stroke-opacity=".28" stroke-width="3"/>
    <rect x="150" y="165" width="250" height="34" rx="17" fill="${accent}"/>
    <rect x="150" y="235" width="680" height="18" rx="9" fill="#ffffff" opacity=".72"/>
    <rect x="150" y="277" width="510" height="18" rx="9" fill="#ffffff" opacity=".3"/>
    <rect x="150" y="360" width="270" height="235" rx="20" fill="${accent}" opacity=".3"/>
    <rect x="450" y="360" width="270" height="235" rx="20" fill="#ffffff" opacity=".12"/>
    <rect x="750" y="360" width="270" height="235" rx="20" fill="#ffffff" opacity=".12"/>
    <text x="150" y="645" fill="#ffffff" font-family="Arial,sans-serif" font-size="26" opacity=".82">${title}</text>
  </svg>`;

const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "portfolio-seed-"));
const imagePath = async (name: string, svg: string) => {
  const filePath = path.join(tempDirectory, name);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  await writeFile(filePath, png);
  return filePath;
};

let payload: Awaited<ReturnType<typeof getPayload>> | undefined;

try {
  payload = await getPayload({ config });
  const demoImages = [
    {
      alt: "Imagen ficticia de demo: Nébula inventario",
      caption: "Recurso generado automáticamente para datos de prueba.",
      file: await imagePath(
        "nebula-inventario.png",
        fakeImageSvg("#203354", "#60d6c8", "NEBULA / INVENTARIO"),
      ),
    },
    {
      alt: "Imagen ficticia de demo: Brisa clima",
      caption: "Recurso generado automáticamente para datos de prueba.",
      file: await imagePath(
        "brisa-clima.png",
        fakeImageSvg("#342451", "#f0a86b", "BRISA / CLIMA"),
      ),
    },
  ];

  const mediaIDs: string[] = [];
  for (const image of demoImages) {
    const existing = await payload.find({
      collection: "media",
      where: { alt: { equals: image.alt } },
      limit: 1,
      overrideAccess: true,
    });

    const media = existing.docs[0] ?? await payload.create({
      collection: "media",
      data: { alt: image.alt, caption: image.caption },
      filePath: image.file,
      overrideAccess: true,
    });
    mediaIDs.push(String(media.id));
  }

  const projects = [
    {
      title: "Nébula — Panel de inventario (demo)",
      slug: "demo-nebula-inventario",
      summary: "Proyecto ficticio para probar tarjetas, tecnologías y casos de estudio.",
      cardImage: mediaIDs[0],
      category: "Aplicación web",
      technologies: [{ name: "Next.js" }, { name: "MongoDB" }, { name: "Payload CMS" }],
      featured: true,
      featuredOrder: 1,
      role: "Desarrollo full stack (dato ficticio)",
      year: 2025,
      problem: lexicalText(["El equipo ficticio llevaba el inventario en hojas separadas y no podía ver existencias actualizadas."]),
      solution: lexicalText(["Se diseñó un panel de demostración con catálogo, movimientos de stock y filtros por categoría."]),
      features: [
        { title: "Catálogo", description: "Consulta de productos con búsqueda y filtros." },
        { title: "Movimientos", description: "Registro ficticio de entradas y salidas." },
      ],
      architecture: lexicalText(["Interfaz Next.js, CMS Payload y almacenamiento de documentos en MongoDB; descripción completamente de prueba."]),
      decisions: [{ decision: "Separar contenido y presentación", reason: "Permite editar los datos desde el CMS sin duplicar textos en las páginas." }],
      results: [{ title: "Resultado de demo", description: "Datos de muestra; no representa métricas de un cliente real." }],
      demoUrl: "https://example.com/demo-nebula",
      repositoryUrl: "https://github.com/example/demo-nebula",
      status: "published" as const,
    },
    {
      title: "Brisa — API meteorológica (demo)",
      slug: "demo-brisa-clima",
      summary: "Caso ficticio para probar proyectos no destacados y enlaces de recursos.",
      cardImage: mediaIDs[1],
      category: "API e integración",
      technologies: [{ name: "TypeScript" }, { name: "Node.js" }, { name: "REST" }],
      featured: true,
      featuredOrder: 2,
      role: "Diseño e integración (dato ficticio)",
      year: 2024,
      problem: lexicalText(["Una aplicación ficticia necesitaba presentar datos meteorológicos de manera clara."]),
      solution: lexicalText(["Se creó una API de demostración que normaliza respuestas y muestra pronóstico por ciudad."]),
      features: [{ title: "Búsqueda por ciudad", description: "Permite consultar un pronóstico de ejemplo." }],
      architecture: lexicalText(["Cliente web conectado a una capa API que organiza los datos antes de mostrarlos."]),
      decisions: [{ decision: "Aislar la integración", reason: "Facilita cambiar el proveedor externo sin reescribir la interfaz." }],
      results: [{ title: "Resultado de demo", description: "Contenido simulado para verificar la estructura editorial." }],
      demoUrl: "https://example.com/demo-brisa",
      repositoryUrl: "https://github.com/example/demo-brisa",
      status: "draft" as const,
    },
  ];

  for (const project of projects) {
    const existing = await payload.find({
      collection: "projects",
      where: { slug: { equals: project.slug } },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length) {
      console.info(`Ya existe el proyecto seed: ${project.slug}; se conserva sin cambios.`);
      continue;
    }

    await payload.create({ collection: "projects", data: project, overrideAccess: true });
    console.info(`Proyecto creado: ${project.slug}`);
  }

  const posts = [
    {
      title: "Cómo separar contenido y presentación (artículo demo)",
      slug: "demo-contenido-y-presentacion",
      excerpt: "Artículo ficticio para verificar el formulario del blog y su publicación.",
      coverImage: mediaIDs[0],
      content: lexicalText([
        "Este artículo es contenido ficticio para probar Payload CMS.",
        "El contenido se guarda como texto enriquecido y puede consultarse desde Next.js.",
      ]),
      category: "Arquitectura",
      tags: [{ name: "Payload" }, { name: "Next.js" }],
      publishedAt: "2025-04-10T12:00:00.000Z",
      status: "published" as const,
    },
    {
      title: "Notas de una integración API (borrador demo)",
      slug: "demo-notas-integracion-api",
      excerpt: "Borrador ficticio para probar que el contenido no publicado queda oculto.",
      coverImage: mediaIDs[1],
      content: lexicalText(["Este borrador contiene información de prueba y no es visible públicamente."]),
      category: "Integraciones",
      tags: [{ name: "API" }, { name: "Aprendizajes" }],
      status: "draft" as const,
    },
  ];

  for (const post of posts) {
    const existing = await payload.find({
      collection: "posts",
      where: { slug: { equals: post.slug } },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length) {
      console.info(`Ya existe el artículo seed: ${post.slug}; se conserva sin cambios.`);
      continue;
    }

    await payload.create({ collection: "posts", data: post, overrideAccess: true });
    console.info(`Artículo creado: ${post.slug}`);
  }

  const experiences = [
    {
      position: "Desarrollador de software (demo)",
      company: "Laboratorio Ficticio",
      location: "Remoto",
      employmentType: "full-time" as const,
      startDate: "2022-01-01T12:00:00.000Z",
      endDate: "2024-03-01T12:00:00.000Z",
      current: false,
      summary: "Experiencia inventada para probar el listado profesional.",
      achievements: [
        { description: "Implementó funcionalidades ficticias para la demostración." },
        { description: "Colaboró en una interfaz de prueba para gestión de datos." },
      ],
      technologies: [{ name: "TypeScript" }, { name: "React" }],
      sortOrder: 1,
      status: "published" as const,
    },
    {
      position: "Ingeniero de integración (demo)",
      company: "Nube de Prueba",
      location: "Ciudad de México",
      employmentType: "contract" as const,
      startDate: "2024-04-01T12:00:00.000Z",
      current: true,
      summary: "Registro ficticio en borrador para probar el estado de publicación.",
      achievements: [{ description: "Preparó flujos simulados de integración y monitoreo." }],
      technologies: [{ name: "Node.js" }, { name: "MongoDB" }],
      sortOrder: 2,
      status: "draft" as const,
    },
  ];

  for (const experience of experiences) {
    const existing = await payload.find({
      collection: "experiences",
      where: {
        and: [
          { position: { equals: experience.position } },
          { company: { equals: experience.company } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length) {
      console.info(`Ya existe la experiencia seed de ${experience.company}; se conserva sin cambios.`);
      continue;
    }

    await payload.create({ collection: "experiences", data: experience, overrideAccess: true });
    console.info(`Experiencia creada: ${experience.position} — ${experience.company}`);
  }

  const existingProfile = await payload.findGlobal({
    slug: "profile",
    depth: 0,
    overrideAccess: true,
  });

  if (existingProfile.name || existingProfile.professionalTitle) {
    console.info("El perfil ya contiene datos; se conservó sin sobrescribirlo.");
  } else {
    await payload.updateGlobal({
      slug: "profile",
      data: {
        name: "Alex Rivera (perfil ficticio)",
        professionalTitle: "Desarrollador de software de demostración",
        headline: "Perfil de prueba generado por la seed; reemplazar antes de publicar.",
        about: lexicalText(["Biografía ficticia para revisar el Global de perfil y sus campos."]),
        location: "Ciudad de México (dato ficticio)",
        contactEmail: "alex.rivera@example.com",
      },
      overrideAccess: true,
    });
    console.info("Perfil ficticio de prueba creado.");
  }

  console.info("Seed completada. Todos los registros creados están marcados como datos de demostración.");
} finally {
  await rm(tempDirectory, { recursive: true, force: true });
  await payload?.destroy();
}
