"use client";

import { usePathname } from "next/navigation";
import { InteractiveCharacter } from "./interactive-character";
import {
  HOME_PATH,
  isHomePath,
  SECTION_ITEMS,
} from "./navigation-config";
import { RouteTransitionLink } from "./route-transition-link";
import { ThemeToggle } from "./theme-toggle";

const NAVIGATION_ITEMS = [
  {
    number: "00/",
    label: "Inicio",
    href: HOME_PATH,
  },
  ...SECTION_ITEMS,
];

export function SiteHeader({ onNavigate }: { onNavigate: (href: string) => void }) {
  const pathname = usePathname();
  const isHome = isHomePath(pathname);
  const isProjectDetail = /^\/projects\/[^/]+\/?$/.test(pathname);

  if (isProjectDetail) return null;

  return (
    <header className="site-header">
      {isHome ? (
        <RouteTransitionLink
          href={HOME_PATH}
          className="site-brand font-display"
          aria-label="Ir al inicio"
          data-cursor="action"
        >
          <span aria-hidden="true">AX</span>
        </RouteTransitionLink>
      ) : (
        <div className="site-character-slot">
          <InteractiveCharacter
            variant="brand"
            ariaLabel="Saltar y regresar al inicio"
            onJumpComplete={() => onNavigate(HOME_PATH)}
          />
        </div>
      )}

      <nav className="site-navigation font-body" aria-label="Navegación principal">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive =
            item.href === HOME_PATH
              ? isHome
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <RouteTransitionLink
              key={item.href}
              href={item.href}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="site-navigation-number font-mono">
                {item.number.slice(0, 2)}
              </span>
              <span className="site-navigation-label">{item.label}</span>
            </RouteTransitionLink>
          );
        })}
        <span className="site-navigation-theme">
          <ThemeToggle placement="navigation" />
        </span>
      </nav>
    </header>
  );
}
