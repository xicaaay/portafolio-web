"use client";

import { usePathname } from "next/navigation";
import { SECTION_ITEMS } from "./navigation-config";
import { RouteTransitionLink } from "./route-transition-link";

export function SectionNavigation({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      className={compact ? "section-navigation is-compact" : "section-navigation"}
      aria-label="Navegación entre secciones"
    >
      {SECTION_ITEMS.map((item) => (
        <RouteTransitionLink
          key={item.href}
          href={item.href}
          className={pathname === item.href ? "is-active" : undefined}
        >
          <span className="section-navigation-number font-mono">
            {item.number.slice(0, 2)}
          </span>
          <span>{item.label}</span>
        </RouteTransitionLink>
      ))}
    </nav>
  );
}
