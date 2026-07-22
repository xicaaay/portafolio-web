"use client";

import { usePathname } from "next/navigation";
import { SECTION_ITEMS } from "./navigation-config";
import { RouteTransitionLink } from "./route-transition-link";

const NAVIGATION_ITEMS = [
  {
    number: "00/",
    label: "Inicio",
    href: "/",
  },
  ...SECTION_ITEMS,
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <RouteTransitionLink
        href="/"
        className="site-brand font-display"
        aria-label="Ir al inicio"
        data-cursor="action"
      >
        <span aria-hidden="true">AX</span>
      </RouteTransitionLink>

      <nav className="site-navigation font-body" aria-label="Navegación principal">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
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
      </nav>
    </header>
  );
}
