import type { ReactNode } from "react";

import styles from "./macos-window.module.css";

export type MacOSWindowProps = {
  /** Optional centered title in the window toolbar. */
  title?: string;
  /** Accessible label for the window frame. */
  ariaLabel?: string;
  /** Content rendered below the toolbar. */
  children?: ReactNode;
  /** Extra class for sizing or positioning the outer window. */
  className?: string;
  /** Extra class for the content area. */
  contentClassName?: string;
};

export function MacOSWindow({
  title,
  ariaLabel,
  children,
  className,
  contentClassName,
}: MacOSWindowProps) {
  const windowClassName = [styles.window, className].filter(Boolean).join(" ");
  const bodyClassName = [styles.content, contentClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      aria-label={ariaLabel ?? title ?? "Ventana estilo macOS"}
      className={windowClassName}
    >
      <header className={styles.toolbar}>
        <div aria-hidden="true" className={styles.trafficLights}>
          <span className={`${styles.trafficLight} ${styles.close}`} />
          <span className={`${styles.trafficLight} ${styles.minimize}`} />
          <span className={`${styles.trafficLight} ${styles.maximize}`} />
        </div>
        {title ? (
          <span aria-hidden="true" className={styles.title}>
            {title}
          </span>
        ) : null}
        <div aria-hidden="true" className={styles.windowMenu}>
          <span />
          <span />
          <span />
        </div>
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
