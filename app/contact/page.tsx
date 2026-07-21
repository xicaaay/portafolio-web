import type { Metadata } from "next";
import { getPublicProfile } from "../about-me/profile-data";
import { ContactView } from "./contact-view";

export const metadata: Metadata = {
  title: "Contacto — Amilcar",
  description:
    "Formulario de contacto directo por correo en navegador o WhatsApp.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await getPublicProfile();
  return <ContactView result={result} />;
}
