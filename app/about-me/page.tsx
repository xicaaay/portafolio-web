import type { Metadata } from "next";
import { AboutMeView } from "./about-me-view";
import { getPublicProfile } from "./profile-data";

export const metadata: Metadata = {
  title: "Sobre mí — Amilcar",
  description: "Perfil profesional, biografía y enlaces públicos de Amilcar.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await getPublicProfile();
  return <AboutMeView result={result} />;
}
