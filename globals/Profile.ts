import type { GlobalConfig } from "payload";

export const Profile: GlobalConfig = {
  slug: "profile",
  label: "Perfil y redes sociales",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "name", type: "text", required: true, label: "Nombre" },
    {
      name: "professionalTitle",
      type: "text",
      required: true,
      label: "Título profesional",
    },
    { name: "headline", type: "textarea", label: "Presentación breve" },
    { name: "about", type: "richText", label: "Sobre mí" },
    { name: "location", type: "text", label: "Ubicación" },
    { name: "contactEmail", type: "email", label: "Correo de contacto" },
    {
      name: "profileImage",
      type: "upload",
      relationTo: "media",
      label: "Foto de perfil",
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Redes sociales",
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "LinkedIn", value: "linkedin" },
            { label: "GitHub", value: "github" },
            { label: "X", value: "x" },
            { label: "Instagram", value: "instagram" },
            { label: "YouTube", value: "youtube" },
            { label: "Behance", value: "behance" },
            { label: "Dribbble", value: "dribbble" },
            { label: "Otra", value: "other" },
          ],
        },
        { name: "label", type: "text", label: "Nombre visible" },
        { name: "url", type: "text", required: true, label: "URL" },
      ],
    },
  ],
};
