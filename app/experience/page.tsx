import type { Metadata } from "next";
import { getPublicExperiences } from "../lib/public-api";
import { ExperienceView } from "./experience-view";

export const metadata: Metadata = {
  title: "Experiencia — Amilcar",
  description:
    "Recorrido profesional, responsabilidades y tecnologías utilizadas por Amilcar.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await getPublicExperiences();
  return <ExperienceView result={result} />;
}
