import Image from "next/image";
import { notFound } from "next/navigation";

import { getExperiences } from "../../../lib/experiences";
import { hasLocale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/dictionaries";
import { getProfile } from "../../../lib/profile";
import { getFeaturedProjects } from "../../../lib/projects";
import { AboutSection } from "../about-section";
import { BrushStrokes } from "../brush-strokes";
import { ContactSection } from "../contact-section";
import { FeaturedProjects } from "../featured-projects";
import { MotionRoot, Reveal } from "../home-motion";
import { LanguageSwitch } from "../language-switch";
import { ScrollFade } from "../scroll-fade";
import { ScrollHint } from "../scroll-hint";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "../site-data";
import { StickyLogo } from "../sticky-logo";
import { TrajectorySection } from "../trajectory-section";
import styles from "../home-landing.module.css";

/* El inicio se regenera cada minuto para reflejar los cambios hechos en Payload. */
export const revalidate = 60;

/* tilt en grados; shift en unidades cqi (desplazamiento lateral; 0 = todos alineados). */
const ROUTES = [
  { key: "projects", href: "#proyectos", tone: "ink", tilt: -4.5, shift: 0 },
  { key: "about", href: "#sobre-mi", tone: "paper", tilt: 3, shift: 0 },
  { key: "career", href: "#trayectoria", tone: "ink", tilt: -2.5, shift: 0 },
  { key: "contact", href: "#contacto", tone: "red", tilt: 3.5, shift: 0 },
] as const;

const BRUSH_ITEMS = [
  { brush: 1, className: styles.brush1 },
  { brush: 2, className: styles.brush2 },
  { brush: 3, className: styles.brush3 },
  { brush: 4, className: styles.brush4 },
  { brush: 5, className: styles.brush5 },
  { brush: 6, className: styles.brush6 },
] as const;

/* Tamaños aproximados de cada imagen según el breakpoint del layout. */
const STICKER_SIZES = "(max-width: 896px) 30vw, 14vw";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const [projects, profile, experiences] = await Promise.all([
    getFeaturedProjects(lang, 3),
    getProfile(lang),
    getExperiences(lang, dict.career),
  ]);

  return (
    <main className={styles.stage} id="inicio">
      <MotionRoot>
        <LanguageSwitch current={lang} fixed label={dict.common.changeLanguage} tone="blue" />
        <ScrollHint href="#proyectos" label={dict.common.scrollDown} />

        {/* El logo sube con la página y, al llegar arriba, se queda fijo como encabezado. */}
        <StickyLogo alt={dict.common.logoAlt} goHome={dict.common.goHome} sizes={STICKER_SIZES} />

        <div className={styles.heroGrid}>
          <BrushStrokes className={styles.brushes} items={BRUSH_ITEMS} />

          <h1 className={styles.srOnly}>Amilcar Xicay — Full Stack Developer</h1>

          <section className={styles.hero}>
            <ScrollFade>
              <Reveal delay={0.05}>
                <p className={styles.lead}>
                  <span>{dict.hero.leadA}</span>
                  <span className={styles.leadSoft}>{dict.hero.leadB}</span>
                </p>
              </Reveal>

              <Reveal delay={0.25}>
                <p className={styles.greeting}>{dict.hero.greeting}</p>
              </Reveal>

              <Reveal delay={0.33}>
                <p className={styles.support}>{dict.hero.support}</p>
              </Reveal>
            </ScrollFade>

            <ul aria-label={dict.common.socialLinks} className={styles.socials}>
              {SOCIAL_LINKS.map(({ label, href, Icon }, index) => (
                <Reveal as="li" delay={0.5 + index * 0.06} key={label}>
                  <a
                    aria-label={label}
                    href={href}
                    rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    title={label}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                </Reveal>
              ))}
              <Reveal as="li" delay={0.5 + SOCIAL_LINKS.length * 0.06}>
                <a className={styles.emailLink} href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </Reveal>
            </ul>

            {/* Composición de stickers: la flecha apunta a la nota y el logo queda debajo. */}
            <div className={styles.notes}>
              {/* Marcador: el logo real vive en <StickyLogo /> y empieza en este lugar. */}
              <div aria-hidden="true" className={`${styles.sticker} ${styles.stickerAx}`} id="logo-anchor" />

              <ScrollFade className={`${styles.sticker} ${styles.stickerArrow}`}>
                <Reveal delay={0.8} kind="sticker">
                  <Image
                    alt=""
                    aria-hidden="true"
                    className={`${styles.stickerImage} ${styles.arrowImage}`}
                    height={506}
                    priority
                    sizes={STICKER_SIZES}
                    src="/flecha-nota.webp"
                    width={700}
                  />
                </Reveal>
              </ScrollFade>

              <ScrollFade className={`${styles.sticker} ${styles.stickerNote}`}>
                <Reveal delay={0.7} kind="sticker">
                  <Image
                    alt={dict.images.heroNoteAlt}
                    className={`${styles.stickerImage} ${styles.noteImage}`}
                    height={720}
                    priority
                    sizes={STICKER_SIZES}
                    src={dict.images.heroNote}
                    width={720}
                  />
                </Reveal>
              </ScrollFade>
            </div>
          </section>

          <nav aria-label={dict.nav.sections} className={styles.routes}>
            {ROUTES.map((route, index) => (
              <div className={styles.routeItem} key={route.key}>
                <Reveal
                  className={styles.routeShift}
                  delay={1 + index * 0.1}
                  kind="sign"
                  style={{ "--tilt": `${route.tilt}deg`, "--shift": route.shift } as React.CSSProperties}
                >
                  <a className={`${styles.route} ${styles[route.tone]}`} href={route.href}>
                    {dict.nav[route.key]}
                  </a>
                </Reveal>
              </div>
            ))}
          </nav>
        </div>

        <FeaturedProjects dict={dict} lang={lang} projects={projects} />
        <AboutSection dict={dict} profile={profile} />
        <TrajectorySection dict={dict} experiences={experiences} />
        <ContactSection dict={dict} lang={lang} profile={profile} />
      </MotionRoot>
    </main>
  );
}
