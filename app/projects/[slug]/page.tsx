import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProject } from "../../lib/public-api";
import { ProjectPageView } from "./project-page-view";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Detalle de proyecto — Amilcar",
  description: "Caso de estudio y detalles técnicos del proyecto.",
};

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const result = await getPublicProject(slug);

  if (result.status !== "success") {
    notFound();
  }

  return <ProjectPageView project={result.data} />;
}
