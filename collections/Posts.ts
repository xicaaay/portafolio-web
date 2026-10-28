import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "Artículo",
    plural: "Artículos del blog",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "status"],
  },
  access: {
    read: ({ req: { user } }) =>
      user ? true : { status: { equals: "published" } },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    { name: "excerpt", type: "textarea", required: true, maxLength: 240 },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    { name: "content", type: "richText", required: true },
    { name: "category", type: "text" },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "name", type: "text", required: true }],
    },
    { name: "publishedAt", type: "date" },
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
