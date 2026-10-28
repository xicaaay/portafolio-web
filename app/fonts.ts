import localFont from "next/font/local";

export const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-variable.ttf",
  variable: "--font-space-grotesk",
  weight: "400 700",
  style: "normal",
  display: "swap",
});

export const inter = localFont({
  src: "./fonts/inter-variable.ttf",
  variable: "--font-inter",
  weight: "400 600",
  style: "normal",
  display: "swap",
});

export const barlowCondensed = localFont({
  src: [
    {
      path: "./fonts/barlow-condensed-extra-bold-italic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "./fonts/barlow-condensed-black-italic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const jetBrainsMono = localFont({
  src: [
    {
      path: "./fonts/jetbrains-mono-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/jetbrains-mono-medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const bowlbyOne = localFont({
  src: "./fonts/bowlby-one-regular.ttf",
  variable: "--font-bowlby-one",
  weight: "400",
  style: "normal",
  display: "swap",
});
