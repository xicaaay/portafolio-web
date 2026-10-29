import Image from "next/image";
import Link from "next/link";

import { localePath, type Locale } from "../../lib/i18n/config";
import type { Dictionary } from "../../lib/i18n/dictionaries";
import { LanguageSwitch } from "./language-switch";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "./site-data";
import styles from "./site-header.module.css";

const NAV = [
  { key: "home", href: "/" },
  { key: "projects", href: "/projects" },
  { key: "about", href: "/#sobre-mi" },
  { key: "contact", href: "/contact" },
] as const;

export type NavKey = (typeof NAV)[number]["key"];

/* Encabezado de las páginas interiores: logo, navegación, redes y selector de idioma. */
export function SiteHeader({ current, dict, lang }: { current?: NavKey; dict: Dictionary; lang: Locale }) {
  return (
    <header className={styles.header}>
      <Link aria-label={dict.common.goHome} className={styles.logo} href={localePath(lang)}>
        <Image alt={dict.common.logoAlt} height={309} priority sizes="96px" src="/sticker-ax.webp" width={454} />
      </Link>

      <nav aria-label={dict.nav.main} className={styles.nav}>
        {NAV.map((item) => (
          <Link
            aria-current={item.key === current ? "page" : undefined}
            href={localePath(lang, item.href)}
            key={item.key}
          >
            {dict.nav[item.key]}
          </Link>
        ))}
      </nav>

      <div className={styles.tools}>
        <ul aria-label={dict.common.socialLinks} className={styles.socials}>
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                aria-label={label}
                href={href}
                rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                target={href.startsWith("http") ? "_blank" : undefined}
                title={label}
              >
                <Icon aria-hidden="true" />
              </a>
            </li>
          ))}
          <li>
            <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </li>
        </ul>

        <LanguageSwitch current={lang} label={dict.common.changeLanguage} tone="paper" />
      </div>
    </header>
  );
}
