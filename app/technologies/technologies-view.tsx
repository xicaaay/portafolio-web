"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FiMousePointer, FiX } from "react-icons/fi";
import { ContentState } from "../components/content-state";
import { MagneticTitle } from "../components/magnetic-title";
import { SECTION_ITEMS } from "../components/navigation-config";
import { SectionPageShell } from "../components/section-page-shell";
import { TechnologyGlyph } from "../components/technology-glyph";
import type {
  PublicApiLoadResult,
  PublicTechnology,
} from "../lib/public-api";
import styles from "./technologies.module.css";

type TechnologiesViewProps = {
  result: PublicApiLoadResult<PublicTechnology[]>;
};

const CATEGORY_LABELS: Record<string, string> = {
  LANGUAGE: "Lenguajes",
  FRAMEWORK: "Frameworks",
  LIBRARY: "Librerías",
  DATABASE: "Bases de datos",
  TOOL: "Herramientas",
  PLATFORM: "Plataformas",
  SERVICE: "Servicios",
  CLOUD: "Cloud",
  AUTOMATION: "Automatización",
  AI: "Inteligencia artificial",
  OTHER: "Otros",
};

function getCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category.replaceAll("_", " ");
}

function getCategoryId(category: string) {
  return `tecnologias-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function MagneticTechnologyButton({
  technology,
  index,
  onSelect,
}: {
  technology: PublicTechnology;
  index: number;
  onSelect: (technology: PublicTechnology) => void;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isActive, setIsActive] = useState(false);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, {
    stiffness: 118,
    damping: 11,
    mass: 0.42,
  });
  const springY = useSpring(offsetY, {
    stiffness: 118,
    damping: 11,
    mass: 0.42,
  });

  const release = () => {
    setIsActive(false);
    offsetX.set(0);
    offsetY.set(0);
  };

  const followPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const distanceX = event.clientX - (bounds.left + bounds.width / 2);
    const distanceY = event.clientY - (bounds.top + bounds.height / 2);
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;

    setIsActive(true);
    event.currentTarget.style.setProperty("--magnetic-x", `${pointerX}%`);
    event.currentTarget.style.setProperty("--magnetic-y", `${pointerY}%`);
    offsetX.set(Math.max(-30, Math.min(30, distanceX * 0.32)));
    offsetY.set(Math.max(-18, Math.min(18, distanceY * 0.42)));
  };

  return (
    <motion.button
      type="button"
      className={styles.technologyItem}
      style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      animate={{ scale: !shouldReduceMotion && isActive ? 1.075 : 1 }}
      viewport={{ once: true, amount: 0.65 }}
      transition={{ duration: 0.38, delay: Math.min(index * 0.04, 0.24) }}
      onPointerMove={followPointer}
      onPointerLeave={release}
      onFocus={() => setIsActive(true)}
      onBlur={release}
      onClick={() => onSelect(technology)}
      data-cursor="action"
      data-magnetic-active={isActive ? "true" : undefined}
      aria-label={`Ver detalles de ${technology.name}`}
    >
      <TechnologyGlyph
        name={technology.name}
        iconKey={technology.iconKey}
      />
      <span>{technology.name}</span>
    </motion.button>
  );
}

function TechnologyDialog({
  technology,
  onClose,
}: {
  technology: PublicTechnology | null;
  onClose: () => void;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (!technology) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, technology]);

  return (
    <AnimatePresence>
      {technology && (
        <motion.div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="technology-dialog-title"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.08 : 0.24 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.article
            className={styles.modal}
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: "1.5rem", scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "1rem", scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            data-cursor-color="var(--cursor-primary)"
          >
            <span className={`${styles.modalCorner} ${styles.modalCornerTl}`} />
            <span className={`${styles.modalCorner} ${styles.modalCornerTr}`} />
            <span className={`${styles.modalCorner} ${styles.modalCornerBl}`} />
            <span className={`${styles.modalCorner} ${styles.modalCornerBr}`} />

            <button
              type="button"
              className={styles.modalClose}
              onClick={onClose}
              aria-label="Cerrar detalle de tecnología"
              data-cursor="action"
              autoFocus
            >
              <FiX aria-hidden="true" />
            </button>

            <div className={styles.modalIcon} data-blue-icon>
              <TechnologyGlyph
                name={technology.name}
                iconKey={technology.iconKey}
              />
            </div>

            <div className={styles.modalContent}>
              <span className="section-route-marker font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.1em] uppercase">
                DETALLE / {getCategoryLabel(technology.category)}
              </span>
              <MagneticTitle
                as="h2"
                id="technology-dialog-title"
                text={technology.name}
                className={styles.modalTitle}
              />
              <p>
                {technology.description ??
                  "Tecnología activa dentro del stack público del portafolio."}
              </p>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TechnologiesCollage({
  technologies,
}: {
  technologies: PublicTechnology[];
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [selectedTechnology, setSelectedTechnology] =
    useState<PublicTechnology | null>(null);

  const categories = useMemo(() => {
    const values = new Map<string, number>();

    technologies.forEach((technology) => {
      values.set(technology.category, (values.get(technology.category) ?? 0) + 1);
    });

    return Array.from(values.entries());
  }, [technologies]);

  const scrollToCategory = (category: string) => {
    document.getElementById(getCategoryId(category))?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <>
      <nav
        className="soft-strip mb-[clamp(1.5rem,3vw,3rem)] flex flex-wrap items-center justify-between gap-5 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(1rem,2vw,1.5rem)]"
        aria-label="Categorías de tecnologías"
      >
        <div className="flex flex-wrap gap-x-[clamp(1rem,2vw,2rem)] gap-y-3">
          {categories.map(([category, count]) => (
            <button
              type="button"
              className={styles.categoryLink}
              key={category}
              onClick={() => scrollToCategory(category)}
              data-cursor="action"
            >
              {String(count).padStart(2, "0")} / {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        <span className="inline-flex items-center gap-3 font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.08em] text-[var(--muted)] uppercase">
          <FiMousePointer
            className="text-[var(--accent)]"
            aria-hidden="true"
            data-blue-icon
          />
          Selecciona una tecnología
        </span>
      </nav>

      <div className="grid min-w-0 gap-[clamp(2.5rem,5vw,5rem)]">
        {categories.map(([category, count], categoryIndex) => (
          <section
            id={getCategoryId(category)}
            className={styles.categorySection}
            key={category}
            aria-labelledby={`${getCategoryId(category)}-title`}
          >
            <div className={styles.categoryHeading}>
              <span className="section-route-marker">
                {String(categoryIndex + 1).padStart(2, "0")} /{" "}
                <span id={`${getCategoryId(category)}-title`}>
                  {getCategoryLabel(category)}
                </span>
              </span>
              <span>{String(count).padStart(2, "0")} TECNOLOGÍAS</span>
            </div>

            <div className={styles.technologyGrid}>
              {technologies
                .filter((technology) => technology.category === category)
                .map((technology, index) => (
                  <MagneticTechnologyButton
                    key={technology.id}
                    technology={technology}
                    index={index}
                    onSelect={setSelectedTechnology}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>

      <TechnologyDialog
        technology={selectedTechnology}
        onClose={() => setSelectedTechnology(null)}
      />
    </>
  );
}

export function TechnologiesView({ result }: TechnologiesViewProps) {
  return (
    <SectionPageShell
      section={SECTION_ITEMS[2]}
      eyebrow="STACK TÉCNICO"
      intro="Lenguajes, frameworks, servicios y herramientas que utilizo para convertir necesidades de producto en soluciones mantenibles. Explora cada categoría y selecciona una tecnología para conocer su detalle."
    >
      {result.status === "success" && (
        <TechnologiesCollage technologies={result.data} />
      )}

      {result.status === "empty" && (
        <ContentState
          type="empty"
          title="Aún no hay tecnologías visibles."
          message="Las tecnologías activas y marcadas para el portafolio aparecerán aquí automáticamente."
        />
      )}

      {result.status === "error" && (
        <ContentState
          type="error"
          title="No pudimos cargar el stack técnico."
          message={result.message}
        />
      )}
    </SectionPageShell>
  );
}
