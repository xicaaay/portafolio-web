import type { Dictionary } from "../../lib/i18n/dictionaries";
import { SOCIAL_LINKS } from "./site-data";
import styles from "./contact-links.module.css";

/*
 * Redes como iconos y el correo como texto con mailto:, igual que en el primer pantallazo.
 * `tone`: «blue» (texto claro, sobre azul) o «paper» (texto oscuro, sobre papel).
 */
export function ContactLinks({ dict, email, tone }: { dict: Dictionary; email: string; tone: "blue" | "paper" }) {
  return (
    <ul aria-label={dict.common.socialLinks} className={`${styles.links} ${tone === "blue" ? styles.blue : styles.paper}`}>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a aria-label={label} href={href} rel="noreferrer noopener" target="_blank" title={label}>
            <Icon aria-hidden="true" />
          </a>
        </li>
      ))}
      <li>
        <a className={styles.email} href={`mailto:${email}`}>
          {email}
        </a>
      </li>
    </ul>
  );
}
