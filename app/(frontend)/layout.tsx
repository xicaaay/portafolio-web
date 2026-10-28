import type { Metadata } from "next";
import "../globals.css";

import {
  barlowCondensed,
  bowlbyOne,
  inter,
  jetBrainsMono,
  spaceGrotesk,
} from "../fonts";

export const metadata: Metadata = {
  title: "Amilcar Xicay — Full-Stack Developer",
  description:
    "Portafolio de Amilcar Xicay: productos digitales, desarrollo full-stack y experiencias web.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${barlowCondensed.variable} ${bowlbyOne.variable} ${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable}`}
      lang="es"
    >
      <body>{children}</body>
    </html>
  );
}
