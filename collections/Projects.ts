import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "updatedAt"],
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
      defaultValue: false,
    },
    {
      name: "featuredOrder",
      type: "number",
      admin: { condition: (_, siblingData) => siblingData?.featured === true },
    },
    {
      name: "role",
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
      type: "richText",
    },
    {
      name: "solution",
      type: "richText",
    },
    {
      name: "features",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
      ],
    },
    {
      name: "architecture",
      type: "richText",
    },
    {
      name: "decisions",
      type: "array",
      fields: [
        { name: "decision", type: "text", required: true },
        { name: "reason", type: "textarea", required: true },
      ],
    },
    {
      name: "results",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
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
        { name: "alt", type: "text", required: true },
        { name: "caption", type: "text" },
      ],
    },
    {
      name: "content",
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
