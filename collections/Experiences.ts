import type { CollectionConfig } from "payload";

export const Experiences: CollectionConfig = {
  slug: "experiences",
  labels: {
    singular: "Experiencia profesional",
    plural: "Experiencia profesional",
  },
  admin: {
    useAsTitle: "position",
    defaultColumns: ["position", "company", "startDate", "current", "status"],
  },
  access: {
    read: ({ req: { user } }) =>
      user ? true : { status: { equals: "published" } },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "position", type: "text", required: true, label: "Puesto" },
    { name: "company", type: "text", required: true, label: "Empresa" },
    { name: "location", type: "text", label: "Ubicación" },
    {
      name: "employmentType",
      type: "select",
      label: "Tipo de empleo",
      options: [
        { label: "Tiempo completo", value: "full-time" },
        { label: "Medio tiempo", value: "part-time" },
        { label: "Contrato", value: "contract" },
        { label: "Freelance", value: "freelance" },
        { label: "Prácticas", value: "internship" },
        { label: "Otro", value: "other" },
      ],
    },
    { name: "startDate", type: "date", required: true, label: "Fecha de inicio" },
    { name: "endDate", type: "date", label: "Fecha de término" },
    { name: "current", type: "checkbox", defaultValue: false, label: "Actualmente" },
    { name: "summary", type: "textarea", label: "Descripción breve" },
    {
      name: "achievements",
      type: "array",
      label: "Responsabilidades y logros",
      fields: [{ name: "description", type: "textarea", required: true }],
    },
    {
      name: "technologies",
      type: "array",
      label: "Tecnologías utilizadas",
      fields: [{ name: "name", type: "text", required: true }],
    },
    { name: "sortOrder", type: "number", label: "Orden de visualización" },
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
