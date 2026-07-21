"use client";

import { useRouter } from "next/navigation";
import type { PublicProject } from "../../lib/public-api";
import { ProjectModal } from "../projects-view";

export function ProjectPageView({ project }: { project: PublicProject }) {
  const router = useRouter();

  return (
    <ProjectModal
      project={project}
      notice={null}
      standalone
      onClose={() => router.push("/projects")}
    />
  );
}
