import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import type { SectionItem } from "./navigation-config";
import { RouteTransitionLink } from "./route-transition-link";

export function InternalPage({ section }: { section: SectionItem }) {
  return (
    <main className="internal-page">
      <section className="internal-hero" aria-labelledby="section-title">
        <div className="internal-section-index font-mono">{section.number}</div>
        <div className="internal-copy">
          <p className="internal-eyebrow font-mono">SECCIÓN</p>
          <h1 id="section-title" className="font-display">
            {section.label}
          </h1>
          <p className="internal-description">{section.description}</p>

          <RouteTransitionLink href="/" className="internal-back-link">
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
