import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import { MagneticTitle } from "./magnetic-title";
import { HOME_PATH, type SectionItem } from "./navigation-config";
import { RouteTransitionLink } from "./route-transition-link";

export function InternalPage({ section }: { section: SectionItem }) {
  return (
    <main className="internal-page">
      <section className="internal-hero" aria-labelledby="section-title">
        <div className="internal-section-index font-mono">{section.number}</div>
        <div className="internal-copy">
          <p className="internal-eyebrow font-mono">SECCIÓN</p>
          <MagneticTitle as="h1" id="section-title" text={section.label} className="font-display" />
          <p className="internal-description">{section.description}</p>

          <RouteTransitionLink href={HOME_PATH} className="internal-back-link">
            <FiArrowLeft aria-hidden="true" />
            Regresar al inicio
          </RouteTransitionLink>
        </div>

        <div className="internal-placeholder" aria-label="Contenido provisional">
          <span className="font-mono">CONTENIDO EN DESARROLLO</span>
          <FiArrowUpRight aria-hidden="true" />
        </div>
      </section>

    </main>
  );
}
