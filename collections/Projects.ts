import { revalidatePath } from "next/cache";
import type { CollectionConfig } from "payload";

/*
 * Al crear, editar o borrar un proyecto se refrescan el inicio, la lista y su detalle para
 * que la web muestre siempre lo que hay en Payload. Fuera de Next (por ejemplo la seed) no
 * hay caché que refrescar, así que el error se ignora.
 */
function refreshPages(_slug?: string | null) {
  try {
    /* Refresca todas las páginas (inicio, lista y detalle) en los dos idiomas. */
    revalidatePath("/", "layout");
  } catch {
    /* sin contexto de Next: nada que refrescar */
  }
}

export const Projects: CollectionConfig = {
  slug: "projects",
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        refreshPages(doc.slug);
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) refreshPages(previousDoc.slug);
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        refreshPages(doc.slug);
        return doc;
      },
    ],
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "featured", "status", "updatedAt"],
  },
  access: {
    read: ({ req: { user } }) =>
      user ? true : { status: { equals: "published" } },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "title",
      localized: true,
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "summary",
      localized: true,
      type: "textarea",
      required: true,
      maxLength: 240,
    },
    {
      name: "cardImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "category",
      localized: true,
      type: "text",
    },
    {
      name: "technologies",
      type: "array",
      fields: [{ name: "name", type: "text", required: true }],
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Proyecto destacado",
      defaultValue: false,
      index: true,
      admin: {
        position: "sidebar",
        description:
          "Los proyectos destacados y publicados se muestran en el inicio (máximo 3, según su orden).",
      },
    },
    {
      name: "featuredOrder",
      type: "number",
      label: "Orden en destacados",
      min: 1,
      admin: {
        position: "sidebar",
        description: "1 aparece primero. Si se deja vacío, va al final.",
        condition: (_, siblingData) => siblingData?.featured === true,
      },
    },
    {
      name: "role",
      localized: true,
      type: "text",
      label: "Mi participación",
    },
    {
      name: "year",
      type: "number",
      min: 1990,
      max: 2100,
    },
    {
      name: "problem",
      localized: true,
      type: "richText",
    },
    {
      name: "solution",
      localized: true,
      type: "richText",
    },
    {
      name: "features",
      type: "array",
      fields: [
        { name: "title",
      localized: true, type: "text", required: true },
        { name: "description",
      localized: true, type: "textarea" },
      ],
    },
    {
      name: "architecture",
      localized: true,
      type: "richText",
    },
    {
      name: "decisions",
      type: "array",
      fields: [
        { name: "decision",
      localized: true, type: "text", required: true },
        { name: "reason",
      localized: true, type: "textarea", required: true },
      ],
    },
    {
      name: "results",
      type: "array",
      fields: [
        { name: "title",
      localized: true, type: "text", required: true },
        { name: "description",
      localized: true, type: "textarea", required: true },
      ],
    },
    {
      name: "demoUrl",
      type: "text",
      label: "URL de demo",
    },
    {
      name: "repositoryUrl",
      type: "text",
      label: "URL de repositorio",
    },
    {
      name: "gallery",
      type: "array",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "alt",
      localized: true, type: "text", required: true },
        { name: "caption",
      localized: true, type: "text" },
      ],
    },
    {
      name: "content",
      localized: true,
      type: "richText",
      admin: {
        description: "Contenido adicional opcional para el caso de estudio.",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Borrador", value: "draft" },
        { label: "Publicado", value: "published" },
      ],
    },
  ],
};
