import type { Metadata } from "next";
import { archivoBlack, geist, jetBrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amilcar — Full Stack Developer",
  description:
    "Portafolio profesional de Amilcar, desarrollador full stack especializado en sistemas, interfaces, APIs e integraciones.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-theme="light"
      suppressHydrationWarning
      className={`${archivoBlack.variable} ${geist.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
