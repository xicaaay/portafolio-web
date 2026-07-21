import type { Metadata } from "next";
import { getPublicProjects } from "../lib/public-api";
import { ProjectsView } from "./projects-view";

export const metadata: Metadata = {
  title: "Proyectos — Amilcar",
  description:
    "Selección de proyectos, sistemas, interfaces e integraciones desarrolladas por Amilcar.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await getPublicProjects();
  return <ProjectsView result={result} />;
}
