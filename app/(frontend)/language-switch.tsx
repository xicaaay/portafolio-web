"use client";


import { LOCALES, LOCALE_COOKIE, LOCALE_LABELS, type Locale } from "../../lib/i18n/config";
import styles from "./language-switch.module.css";

type LanguageSwitchProps = {
  current: Locale;
  /* Texto accesible del grupo («Cambiar idioma»). */
  label: string;
  /* Fondo donde se coloca: «blue» (texto claro) o «paper» (texto oscuro). */
  tone: "blue" | "paper";
  /* true: fijo en la esquina superior derecha (inicio). */
  fixed?: boolean;
};

/*
 * Selector ES | EN. Lleva a la misma página en el otro idioma y recuerda la elección en una
 * cookie para la próxima visita.
 */
export function LanguageSwitch({ current, fixed = false, label, tone }: LanguageSwitchProps) {

  return (
    <nav
      aria-label={label}
      className={`${styles.switch} ${tone === "blue" ? styles.blue : styles.paper} ${fixed ? styles.fixed : ""}`}
    >
      {LOCALES.map((locale) => (
        <button
          aria-pressed={locale === current}
          type="button"
          key={locale}
          lang={locale}
          onClick={() => {
            if (locale === current) return;
            document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
            window.location.reload();
          }}
          title={LOCALE_LABELS[locale].name}
        >
          {LOCALE_LABELS[locale].short}
        </button>
      ))}
    </nav>
  );
}
