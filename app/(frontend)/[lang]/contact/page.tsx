import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { hasLocale } from "../../../../lib/i18n/config";
import { getDictionary } from "../../../../lib/i18n/dictionaries";
import { getProfile } from "../../../../lib/profile";
import { BrushStrokes } from "../../brush-strokes";
import { ContactLinks } from "../../contact-links";
import { CONTACT_EMAIL } from "../../site-data";
import { SiteHeader } from "../../site-header";
import projectStyles from "../projects/projects.module.css";
import { ContactForm } from "./contact-form";
import styles from "./contact.module.css";

export const revalidate = 60;

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    title: dict.meta.contactTitle,
    description: dict.meta.contactDescription,
    alternates: { languages: { es: "/es/contact", en: "/en/contact" } },
  };
}

const BRUSHES = [
  { brush: 8, className: projectStyles.brushLeft },
  { brush: 7, className: projectStyles.brushBottomRight },
  { brush: 9, className: projectStyles.brushTopRight },
] as const;

export default async function ContactPage({ params }: PageParams) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const profile = await getProfile(lang);
  const email = profile?.email ?? CONTACT_EMAIL;

  return (
    <div className={projectStyles.page}>
      <BrushStrokes className={projectStyles.brushes} items={BRUSHES} />
      <SiteHeader current="contact" dict={dict} lang={lang} />

      <main className={projectStyles.main} id="contenido">
        <div className={projectStyles.heroTitle}>
          <h1 className={projectStyles.titleStrip}>{dict.contact.title}</h1>
          <p className={projectStyles.subtitleStrip}>{dict.contactPage.subtitle}</p>
        </div>

        <div className={styles.grid}>
          <div>
            <p className={styles.lead}>{dict.contactPage.lead}</p>

            <ContactLinks dict={dict} email={email} tone="paper" />

            <Image
              alt={dict.images.contactPostAlt}
              className={styles.post}
              height={720}
              sizes="(max-width: 768px) 30vw, 16vw"
              src={dict.images.contactPost}
              width={720}
            />
          </div>

          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>{dict.contactPage.formTitle}</h2>
            <ContactForm dict={dict.form} email={email} tone="dark" />
          </div>
        </div>
      </main>
    </div>
  );
}
