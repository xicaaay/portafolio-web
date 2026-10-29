import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "updatedAt"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    /* Solo imágenes de mapa de bits: se convierten a WebP al subirlas (SVG y GIF se perderían al convertir). */
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "image/avif"],
    formatOptions: { format: "webp", options: { quality: 85 } },
  },
  fields: [
    {
      name: "alt",
      localized: true,
      type: "text",
      required: true,
      label: "Texto alternativo",
    },
    {
      name: "caption",
      localized: true,
      type: "text",
      label: "Pie de imagen",
    },
  ],
};
