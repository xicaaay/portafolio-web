export type SectionItem = {
  number: string;
  label: string;
  href: string;
  description: string;
};

export const HOME_PATH = "/inicio";

export function isHomePath(pathname: string) {
  return pathname === "/" || pathname === HOME_PATH;
}

export const SECTION_ITEMS: SectionItem[] = [
  {
    number: "01/",
    label: "Sobre mí",
    href: "/about-me",
    description:
      "Una introducción a mi perfil, mi forma de trabajar y los principios que guían cada proyecto.",
  },
  {
    number: "02/",
    label: "Proyectos",
    href: "/projects",
    description:
      "Una selección de sistemas, interfaces, automatizaciones e integraciones desarrolladas para resolver problemas reales.",
  },
  {
    number: "03/",
    label: "Tecnologías",
    href: "/technologies",
    description:
      "Herramientas, lenguajes y plataformas que utilizo para construir productos sólidos de principio a fin.",
  },
  {
    number: "04/",
    label: "Experiencia",
    href: "/experience",
    description:
      "Recorrido profesional, responsabilidades y aprendizajes obtenidos al crear soluciones digitales completas.",
  },
  {
    number: "05/",
    label: "Contacto",
    href: "/contact",
    description:
      "Un espacio directo para conversar sobre proyectos, colaboraciones y nuevas oportunidades.",
  },
];
