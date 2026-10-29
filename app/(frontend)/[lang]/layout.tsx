import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../../globals.css";

import { LOCALES, hasLocale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/dictionaries";
import {
  barlowCondensed,
  bowlbyOne,
  inter,
  jetBrainsMono,
  spaceGrotesk,
} from "../../fonts";

type LayoutParams = { params: Promise<{ lang: string }> };

/* Se generan las dos versiones: /es y /en. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    alternates: { languages: { es: "/es", en: "/en" } },
  };
}

export default async function RootLayout({ children, params }: LayoutParams & { children: ReactNode }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      className={`${barlowCondensed.variable} ${bowlbyOne.variable} ${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable}`}
      lang={lang}
    >
      <body>{children}</body>
    </html>
  );
}
