"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import styles from "./home.module.css";

const CODE_SAMPLE = `const developer = {
  name: "Amilcar Xicay",
  craft: ["design", "code"],
  focus: "useful products",
};`;

const PROJECTS = [
  {
    number: "01",
    name: "Nébula",
    label: "Producto digital · Full-stack",
    description: "Un sistema de inventario que convierte operaciones complejas en decisiones claras y rápidas.",
    tags: ["Next.js", "TypeScript", "MongoDB"],
    art: "nebula",
  },
  {
    number: "02",
    name: "Brisa",
    label: "Datos · Experiencia web",
    description: "Clima útil, legible y humano. Una interfaz serena para entender qué viene después.",
    tags: ["API", "React", "Motion"],
    art: "brisa",
  },
  {
    number: "03",
    name: "Atlas",
    label: "Sistemas · Ingeniería",
    description: "Una base modular para lanzar experiencias consistentes sin perder velocidad ni carácter.",
    tags: ["Design system", "UI", "DX"],
    art: "atlas",
  },
] as const;

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 54 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ amount: 0.25, once: false }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CodeTypewriter() {
  const [characterCount, setCharacterCount] = useState(0);
  const reduceMotion = useReducedMotion();
  const visibleCode = reduceMotion ? CODE_SAMPLE : CODE_SAMPLE.slice(0, characterCount);

  useEffect(() => {
    if (reduceMotion || characterCount >= CODE_SAMPLE.length) return;
    const pause = CODE_SAMPLE[characterCount] === "\n" ? 180 : 28;
    const timeout = window.setTimeout(() => setCharacterCount((current) => current + 1), pause);
    return () => window.clearTimeout(timeout);
  }, [characterCount, reduceMotion]);

  return (
    <pre className={styles.code} aria-label={CODE_SAMPLE}>
      <code aria-hidden="true">{visibleCode}</code>
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          className={styles.cursor}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </pre>
  );
}

function HeroCodeCard() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      className={styles.codeCard}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.92, rotate: 2 }}
      animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
      transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.codeTopbar}><span>profile.ts</span><span>● live</span></div>
      <CodeTypewriter />
      <span className={styles.codeIndex}>001—005</span>
    </motion.aside>
  );
}

function ScrollStatement() {
  const target = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [100, 0, 0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.75, 1], [0.92, 1, 1, 0.96]);

  return (
    <section ref={target} className={styles.statement} aria-labelledby="statement-title">
      <motion.div className={styles.statementInner} style={reduceMotion ? undefined : { y, opacity, scale }}>
        <p className={styles.eyebrow}>01 / Principio</p>
        <h2 id="statement-title">Menos ruido.<br />Más <em>intención.</em></h2>
        <p className={styles.statementCopy}>Diseño sistemas digitales donde cada interacción tiene una razón y cada detalle empuja el producto hacia adelante.</p>
      </motion.div>
    </section>
  );
}

function ProjectArtwork({ type, name }: { type: string; name: string }) {
  return (
    <div className={`${styles.projectArt} ${styles[type]}`} role="img" aria-label={`Vista conceptual de ${name}`}>
      <span className={styles.artGrid} />
      <span className={styles.artOrb} />
      <span className={styles.artPanel}><i /><i /><i /></span>
      <span className={styles.artLabel}>{name}.system</span>
    </div>
  );
}

function ProjectsRail() {
  const rail = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: rail, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

  return (
    <section ref={rail} id="proyectos" className={styles.projectsRail} aria-labelledby="projects-title">
      <div className={styles.projectsSticky}>
        <header className={styles.sectionHeader}>
          <div><p className={styles.eyebrow}>02 / Trabajo seleccionado</p><h2 id="projects-title">Construido para funcionar.</h2></div>
          <p className={styles.scrollHint}>Desliza para explorar →</p>
        </header>
        <div className={styles.projectViewport}>
          <motion.div className={styles.projectTrack} style={reduceMotion ? undefined : { x }}>
            {PROJECTS.map((project) => (
              <article className={styles.projectCard} key={project.name}>
                <ProjectArtwork type={project.art} name={project.name} />
                <div className={styles.projectMeta}><span>{project.number}</span><p>{project.label}</p><span>2026</span></div>
                <div className={styles.projectText}><h3>{project.name}</h3><p>{project.description}</p></div>
                <ul className={styles.tags} aria-label={`Tecnologías de ${project.name}`}>
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </article>
            ))}
          </motion.div>
        </div>
        <div className={styles.progressTrack} aria-hidden="true"><motion.span style={{ scaleX: scrollYProgress }} /></div>
      </div>
    </section>
  );
}

export function HomeExperience() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35 });

  return (
    <main className={styles.page}>
      <motion.div className={styles.pageProgress} style={{ scaleX: progress }} />
      <header className={styles.siteHeader}>
        <a className={styles.wordmark} href="#inicio" aria-label="Ir al inicio">AX<span>®</span></a>
        <nav aria-label="Navegación principal"><a href="#proyectos">Proyectos</a><a href="#perfil">Perfil</a><a href="#contacto">Contacto</a></nav>
        <p>Disponible · 2026</p>
      </header>

      <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroIntro}>
          <motion.p className={styles.eyebrow} initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Portafolio / Full-stack developer</motion.p>
          <motion.h1 id="hero-title" initial={reduceMotion ? false : { opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>Ideas que se vuelven <em>producto.</em></motion.h1>
          <motion.div className={styles.heroBottom} initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}>
            <p>Soy Amilcar. Diseño y desarrollo experiencias digitales precisas, rápidas y hechas para durar.</p>
            <a className={styles.primaryAction} href="#proyectos">Ver proyectos <ArrowIcon /></a>
          </motion.div>
        </div>
        <HeroCodeCard />
        <p className={styles.heroCounter}>001 / 005</p>
        <motion.div className={styles.scrollCue} animate={reduceMotion ? undefined : { y: [0, 8, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8 }} aria-hidden="true">↓</motion.div>
      </section>

      <ScrollStatement />
      <ProjectsRail />

      <section id="perfil" className={styles.about} aria-labelledby="about-title">
        <Reveal className={styles.aboutLead}><p className={styles.eyebrow}>03 / Perfil</p><h2 id="about-title">Diseño con lógica.<br />Código con criterio.</h2></Reveal>
        <Reveal className={styles.aboutBody} delay={0.08}>
          <p>Trabajo en la intersección entre producto, diseño e ingeniería. Mi objetivo no es agregar más: es encontrar la forma más clara de resolver lo esencial.</p>
          <dl><div><dt>Enfoque</dt><dd>Producto digital</dd></div><div><dt>Especialidad</dt><dd>Full-stack</dd></div><div><dt>Disponible para</dt><dd>Colaboraciones</dd></div></dl>
        </Reveal>
      </section>

      <section id="contacto" className={styles.contact} aria-labelledby="contact-title">
        <Reveal><p className={styles.eyebrow}>04 / Siguiente paso</p><h2 id="contact-title">Hagamos algo<br /><em>que importe.</em></h2></Reveal>
        <Reveal className={styles.contactBottom} delay={0.08}>
          <p>¿Tienes una idea, un reto o un producto que necesita avanzar?</p>
          <a className={styles.lightAction} href="/cv.pdf" target="_blank" rel="noreferrer">Conoce mi experiencia <ArrowIcon /></a>
        </Reveal>
      </section>

      <footer className={styles.footer}><p>Amilcar Xicay © 2026</p><a href="#inicio">Volver arriba ↑</a></footer>
    </main>
  );
}
