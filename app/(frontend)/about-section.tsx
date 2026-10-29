import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";

import type { Dictionary } from "../../lib/i18n/dictionaries";
import type { ProfileData } from "../../lib/profile";
import { BrushStrokes } from "./brush-strokes";
import { Reveal } from "./home-motion";
import { CONTACT_EMAIL } from "./site-data";
import styles from "./home-landing.module.css";

const ABOUT_BRUSHES = [
  { brush: 3, className: styles.aboutBrush1 },
  { brush: 6, className: styles.aboutBrush2 },
] as const;

/*
 * Sección «Sobre mí»: lee el perfil de Payload. Mientras «Sobre mí» o la frase estén vacíos en
 * Payload (Global → Perfil) usa los textos por defecto del diccionario, en el idioma activo.
 */
export function AboutSection({ dict, profile }: { dict: Dictionary; profile: ProfileData | null }) {
  const title = profile?.title ?? "Full Stack Developer";
  const email = profile?.email ?? CONTACT_EMAIL;
  const quote = profile?.quote ?? dict.about.fallbackQuote;
  const quoteWords = quote.trim().split(/s+/);
  const quoteEnd = quoteWords.pop() ?? "";
  const quoteStart = quoteWords.join(" ");

  const facts = [
    { label: dict.about.profile, value: title },
    { label: dict.about.experience, value: dict.about.experienceValue },
    ...(profile?.location ? [{ label: dict.about.location, value: profile.location }] : []),
  ];

  return (
    <section aria-labelledby="sobre-mi-titulo" className={styles.about} id="sobre-mi">
      <BrushStrokes className={styles.aboutBrushes} items={ABOUT_BRUSHES} />

      <div className={styles.aboutInner}>
        <Reveal kind="rise" onView>
          <h2 className={styles.aboutTitle} id="sobre-mi-titulo">
            {dict.about.title}
          </h2>
        </Reveal>

        <div className={styles.aboutGrid}>
          <Reveal className={styles.aboutSide} kind="rise" onView>
            {profile?.photo && (
              <figure className={styles.aboutPhoto}>
                <Image
                  alt={profile.photo.alt}
                  className={styles.aboutPhotoImage}
                  fill
                  sizes="(max-width: 896px) 70vw, 28vw"
                  src={profile.photo.url}
                />
              </figure>
            )}

            <dl className={styles.facts}>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
              <div>
                <dt>{dict.about.contact}</dt>
                <dd>
                  <a className={styles.aboutEmail} href={`mailto:${email}`}>
                    {email}
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal className={styles.aboutText} delay={0.08} kind="rise" onView>
            {profile?.headline && <p className={styles.aboutLead}>{profile.headline}</p>}

            {profile?.about ? (
              <RichText data={profile.about} />
            ) : (
              dict.about.fallbackParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            )}
          </Reveal>
        </div>

        <Reveal className={styles.quoteWrap} kind="rise" onView>
          <blockquote className={styles.quote}>
            <p>
              <Image alt="" aria-hidden="true" className={styles.quoteOpen} height={268} sizes="120px" src="/comillas-abrir.webp" width={360} />
              {quoteStart}{" "}
              {/* La última palabra y la comilla de cierre no se separan: así la comilla nunca queda sola en otra línea. */}
              <span className={styles.quoteTail}>
                {quoteEnd}
                <Image alt="" aria-hidden="true" className={styles.quoteClose} height={262} sizes="120px" src="/comillas-cerrar.webp" width={360} />
              </span>
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
