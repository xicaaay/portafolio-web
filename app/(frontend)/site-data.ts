import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

/* El correo se muestra como texto (con mailto:), no como icono. */
export const CONTACT_EMAIL = "hello@xicay.dev";

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/xicaaay", Icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/amilcar-xicay/", Icon: FaLinkedinIn },
] as const;
