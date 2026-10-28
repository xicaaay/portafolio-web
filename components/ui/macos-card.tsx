import type { ReactNode } from "react";

import styles from "./macos-window.module.css";

export type MacOSCardProps = {
  /** Optional label displayed in the slim toolbar. */
  title?: string;
  /** Accessible label for the card. */
  ariaLabel?: string;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
};

/** A macOS-inspired panel that keeps the frame and toolbar without window controls. */
export function MacOSCard({
  title,
  ariaLabel,
  children,
  className,
  contentClassName,
}: MacOSCardProps) {
  const cardClassName = [styles.card, className].filter(Boolean).join(" ");
  const bodyClassName = [styles.content, contentClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      aria-label={ariaLabel ?? title ?? "Tarjeta estilo macOS"}
      className={cardClassName}
    >
      <header className={styles.cardToolbar}>
        {title ? <span className={styles.cardTitle}>{title}</span> : null}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
