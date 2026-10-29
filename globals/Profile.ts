import { revalidatePath } from "next/cache";
import type { GlobalConfig } from "payload";

export const Profile: GlobalConfig = {
  slug: "profile",
  label: "Perfil",
  hooks: {
    /* Al guardar el perfil se refresca el inicio (fuera de Next, p. ej. la seed, se ignora). */
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath("/", "layout");
        } catch {
          /* sin contexto de Next: nada que refrescar */
        }
        return doc;
      },
    ],
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "name", type: "text", required: true, label: "Nombre" },
    {
      name: "professionalTitle",
      localized: true,
      type: "text",
      required: true,
      label: "Título profesional",
    },
    { name: "headline",
      localized: true, type: "textarea", label: "Presentación breve" },
    { name: "about",
      localized: true, type: "richText", label: "Sobre mí" },
    {
      name: "quote",
      localized: true,
      type: "textarea",
      label: "Frase destacada",
      admin: {
        description: "Se muestra entre comillas en «Sobre mí». Si se deja vacío, la web usa la frase por defecto.",
      },
    },
    { name: "location",
      localized: true, type: "text", label: "Ubicación" },
    { name: "contactEmail", type: "email", label: "Correo de contacto" },
    {
      name: "profileImage",
      type: "upload",
      relationTo: "media",
      label: "Foto de perfil",
    },
  ],
};
