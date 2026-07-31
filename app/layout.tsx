import type { Metadata } from "next";
import Script from "next/script";
import { PortfolioShell } from "./components/portfolio-shell";
import { archivoBlack, geist, jetBrainsMono } from "./fonts";
import "./globals.css";

const siteTitle = "Amilcar Xicay — Full Stack Developer";
const siteDescription =
  "Amilcar Xicay, portafolio profesional.";
const vercelUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const railwayUrl = process.env.RAILWAY_PUBLIC_DOMAIN;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (railwayUrl
    ? `https://${railwayUrl}`
    : vercelUrl
      ? `https://${vercelUrl}`
      : "http://localhost:3002");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "es_MX",
    title: siteTitle,
    description: siteDescription,
    siteName: "Portafolio de Amilcar Xicay",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vista previa.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vista previa.",
      },
    ],
  },
};

const themeInitializationScript = `
(function () {
  try {
    var storedTheme = window.localStorage.getItem("portfolio-theme");
    var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    var theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : systemTheme;
    var root = document.documentElement;

    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  } catch (error) {
    var fallbackTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    document.documentElement.dataset.theme = fallbackTheme;
    document.documentElement.style.colorScheme = fallbackTheme;
  }
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-theme="light"
      suppressHydrationWarning
      className={`${archivoBlack.variable} ${geist.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <Script
          id="theme-initialization"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
      </head>
      <body>
        <PortfolioShell>{children}</PortfolioShell>
      </body>
    </html>
  );
}
