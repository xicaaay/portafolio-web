"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { usePortfolio } from "./portfolio-shell";

type RouteTransitionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

export function RouteTransitionLink({
  href,
  className,
  children,
  ariaLabel,
}: RouteTransitionLinkProps) {
  const pathname = usePathname();
  const { isTransitioning, targetPath, navigate } = usePortfolio();
  const isCurrent = pathname === href;
  const isSelected = targetPath === href;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(href);
  };

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-current={isCurrent ? "page" : undefined}
      aria-disabled={isTransitioning && !isSelected ? true : undefined}
      tabIndex={isTransitioning && !isSelected ? -1 : undefined}
      data-transition-selected={isSelected ? "true" : undefined}
      data-cursor="action"
    >
      {children}
    </Link>
  );
}
