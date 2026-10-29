import type { CollectionConfig } from "payload";

/*
 * Mensajes enviados desde el formulario de contacto. Se crean únicamente desde la acción del
 * servidor (que valida y filtra el spam); por la API pública nadie puede crear, leer ni borrar.
 */
export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  labels: {
    singular: "Mensaje de contacto",
    plural: "Mensajes de contacto",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "read", "createdAt"],
    description: "Mensajes recibidos desde el formulario de contacto de la web.",
  },
  access: {
    create: () => false,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "name", type: "text", required: true, label: "Nombre" },
    { name: "email", type: "email", required: true, label: "Correo" },
    { name: "message", type: "textarea", required: true, label: "Mensaje" },
    {
      name: "read",
      type: "checkbox",
      defaultValue: false,
      label: "Leído",
      admin: { position: "sidebar" },
    },
  ],
};
