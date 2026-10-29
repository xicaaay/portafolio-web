import Image from "next/image";

import type { Locale } from "../../lib/i18n/config";
import { format, type Dictionary } from "../../lib/i18n/dictionaries";
import type { ProfileData } from "../../lib/profile";
import { BrushStrokes } from "./brush-strokes";
import { ContactLinks } from "./contact-links";
import { ContactForm } from "./[lang]/contact/contact-form";
import { Reveal } from "./home-motion";
import { CONTACT_EMAIL } from "./site-data";
import styles from "./home-landing.module.css";

const CONTACT_BRUSHES = [
  { brush: 3, className: styles.contactBrush1 },
  { brush: 1, className: styles.contactBrush2 },
] as const;

/* Sección «Contacto» y pie de página. El correo sale del perfil de Payload si está cargado. */
export function ContactSection({ dict, lang, profile }: { dict: Dictionary; lang: Locale; profile: ProfileData | null }) {
  const email = profile?.email ?? CONTACT_EMAIL;
  const name = profile?.name ?? "Amilcar Xicay";

  return (
    <section aria-labelledby="contacto-titulo" className={styles.contact} id="contacto">
      <BrushStrokes className={styles.contactBrushes} items={CONTACT_BRUSHES} />

      <div className={styles.contactInner}>
        <div className={styles.contactGrid}>
          <Reveal className={styles.contactLeft} kind="rise" onView>
            <h2 className={styles.contactTitle} id="contacto-titulo">
              {dict.contact.title}
            </h2>
            <p className={styles.contactLead}>{dict.contact.lead}</p>

            <ContactLinks dict={dict} email={email} tone="blue" />

            <Image
              alt={dict.images.contactPostAlt}
              className={styles.contactPost}
              height={720}
              sizes="(max-width: 896px) 30vw, 14vw"
              src={dict.images.contactPost}
              width={720}
            />
          </Reveal>

          <Reveal delay={0.08} kind="rise" onView>
            <ContactForm dict={dict.form} email={email} tone="light" />
          </Reveal>
        </div>

        <footer className={styles.contactFoot}>
          <p>
            {format(dict.contact.copyright, { year: new Date().getFullYear(), name })}
          </p>
          <a href="#inicio">{dict.common.backToTop}</a>
        </footer>
      </div>
    </section>
  );
}
