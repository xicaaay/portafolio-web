import type { Metadata } from "next";
import { archivoBlack, geist, jetBrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amilcar — Full Stack Developer",
  description:
    "Portafolio profesional de Amilcar, desarrollador full stack especializado en sistemas, interfaces, APIs e integraciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${archivoBlack.variable} ${geist.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
