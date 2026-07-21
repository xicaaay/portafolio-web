import { createElement } from "react";
import type { IconType } from "react-icons";
import { FiCode, FiCpu } from "react-icons/fi";
import {
  SiAngular,
  SiApollographql,
  SiDart,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiGithub,
  SiGitlab,
  SiGooglecloud,
  SiGraphql,
  SiJavascript,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiRailway,
  SiReact,
  SiRedis,
  SiSqlite,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVuedotjs,
  SiWhatsapp,
} from "react-icons/si";

const ICONS_BY_KEY: Record<string, IconType> = {
  angular: SiAngular,
  apollographql: SiApollographql,
  dart: SiDart,
  docker: SiDocker,
  express: SiExpress,
  expressjs: SiExpress,
  fastapi: SiFastapi,
  figma: SiFigma,
  firebase: SiFirebase,
  flutter: SiFlutter,
  git: SiGit,
  github: SiGithub,
  gitlab: SiGitlab,
  googlecloud: SiGooglecloud,
  graphql: SiGraphql,
  javascript: SiJavascript,
  js: SiJavascript,
  kubernetes: SiKubernetes,
  linux: SiLinux,
  mongodb: SiMongodb,
  mysql: SiMysql,
  nest: SiNestjs,
  nestjs: SiNestjs,
  next: SiNextdotjs,
  nextjs: SiNextdotjs,
  node: SiNodedotjs,
  nodejs: SiNodedotjs,
  openai: FiCpu,
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  prisma: SiPrisma,
  python: SiPython,
  railway: SiRailway,
  react: SiReact,
  redis: SiRedis,
  sqlite: SiSqlite,
  svelte: SiSvelte,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  ts: SiTypescript,
  typescript: SiTypescript,
  vercel: SiVercel,
  vue: SiVuedotjs,
  vuejs: SiVuedotjs,
  whatsapp: SiWhatsapp,
};

function normalizeIdentifier(value: string | null | undefined) {
  return value?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
}

type TechnologyGlyphProps = {
  name: string;
  iconKey?: string | null;
  className?: string;
};

export function TechnologyGlyph({
  name,
  iconKey,
  className,
}: TechnologyGlyphProps) {
  const candidates = [iconKey, name].map(normalizeIdentifier);
  const Icon =
    candidates.map((candidate) => ICONS_BY_KEY[candidate]).find(Boolean) ?? FiCode;

  return createElement(Icon, { className, "aria-hidden": true });
}
