import Image from "next/image";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa6";

import { BrushStrokes } from "./brush-strokes";
import { MotionRoot, Reveal } from "./home-motion";
import styles from "./home-landing.module.css";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/xicaaay", Icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/xicaaay", Icon: FaLinkedinIn },
  { label: "Correo", href: "mailto:amilcar.xicay@code.com.gt", Icon: FaEnvelope },
] as const;

/* tilt en grados; shift en unidades cqi (porcentaje del ancho del bloque de carteles). */
const ROUTES = [
  { label: "Proyectos", href: "/projects", tone: "ink", tilt: -4.5, shift: -2 },
  { label: "Sobre mí", href: "#sobre-mi", tone: "paper", tilt: 3, shift: 3 },
  { label: "Mi stack", href: "#stack", tone: "ink", tilt: -2.5, shift: -1 },
  { label: "Contacto", href: "#contacto", tone: "red", tilt: 3.5, shift: 2 },
] as const;

/* Tamaños aproximados de cada imagen según el breakpoint del layout. */
const STICKER_SIZES = "(max-width: 896px) 30vw, 14vw";

export default function HomePage() {
  return (
    <main className={styles.stage}>
      <BrushStrokes tallClassName={styles.brushTall} wideClassName={styles.brushWide} />

      <h1 className={styles.srOnly}>Amilcar Xicay — Full Stack Developer</h1>

      <MotionRoot>
        <section className={styles.hero}>
          <Reveal delay={0.05}>
            <p className={styles.lead}>
              <span>Imaginemos algo.</span>
              <span className={styles.leadSoft}>Hagámoslo realidad.</span>
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <p className={styles.greeting}>
              Hola, soy Amilcar, desarrollador de software Full Stack.
            </p>
          </Reveal>

          <Reveal delay={0.33}>
            <p className={styles.support}>
              Me apasiona transformar ideas en soluciones digitales. Tengo dos años de
              experiencia diseñando y desarrollando sistemas, desde su planificación y
              arquitectura hasta su implementación y despliegue.
            </p>
          </Reveal>

          <ul aria-label="Redes sociales" className={styles.socials}>
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
          </ul>

          {/* Composición de stickers: la flecha apunta a la nota y el logo queda debajo. */}
          <div className={styles.notes}>
            <Reveal className={`${styles.sticker} ${styles.stickerAx}`} delay={0.9} kind="sticker" rotate={-10}>
              <Image
                alt="Logotipo AX"
                className={`${styles.stickerImage} ${styles.axImage}`}
                height={309}
                priority
                sizes={STICKER_SIZES}
                src="/sticker-ax.webp"
                width={454}
              />
            </Reveal>

            <Reveal className={`${styles.sticker} ${styles.stickerArrow}`} delay={0.8} kind="sticker">
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

            <Reveal className={`${styles.sticker} ${styles.stickerNote}`} delay={0.7} kind="sticker">
              <Image
                alt="Good ideas build great things."
                className={`${styles.stickerImage} ${styles.noteImage}`}
                height={550}
                priority
                sizes={STICKER_SIZES}
                src="/nota-good-ideas.webp"
                width={492}
              />
            </Reveal>
          </div>
        </section>

        <nav aria-label="Secciones" className={styles.routes}>
          {ROUTES.map((route, index) => (
            <Reveal
              className={styles.routeItem}
              delay={1 + index * 0.1}
              key={route.label}
              kind="sign"
              style={{ "--tilt": `${route.tilt}deg`, "--shift": route.shift } as React.CSSProperties}
            >
              <a className={`${styles.route} ${styles[route.tone]}`} href={route.href}>
                {route.label}
              </a>
            </Reveal>
          ))}
        </nav>
      </MotionRoot>
    </main>
  );
}
