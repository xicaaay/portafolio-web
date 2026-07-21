import type { Metadata } from "next";
import { getPublicTechnologies } from "../lib/public-api";
import { TechnologiesView } from "./technologies-view";

export const metadata: Metadata = {
  title: "Tecnologías — Amilcar",
  description:
    "Stack técnico, lenguajes, frameworks, servicios y herramientas utilizadas por Amilcar.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await getPublicTechnologies();
  return <TechnologiesView result={result} />;
}
