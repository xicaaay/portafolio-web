"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

import { Reveal } from "./home-motion";
import styles from "./home-landing.module.css";

/* Posición en la página sin contar transformaciones (offsetLeft/Top las ignoran). */
function documentPosition(element: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;
  while (node) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

type Box = { x: number; y: number; width: number };

/* Ya en el inicio: sube con scroll suave (sin animar si la persona pidió menos movimiento). */
function scrollToTop(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  /* Quita #proyectos u otro ancla de la dirección. */
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

/*
 * Logo que nace en el inicio, sube con la página y, al llegar al borde superior, se queda
 * fijo como encabezado. Vive en una capa que mide toda la página porque `position: sticky`
 * solo funciona dentro de su contenedor; el marcador (#logo-anchor) del inicio le dice
 * dónde empezar.
 */
export function StickyLogo({ alt, goHome, sizes }: { alt: string; goHome: string; sizes: string }) {
  const [box, setBox] = useState<Box | null>(null);
  const [stuck, setStuck] = useState(false);
  const sticky = useRef<HTMLDivElement>(null);

  /* «Fijo» = ya llegó al borde superior; entonces se achica y se vuelve translúcido. */
  useEffect(() => {
    const update = () => {
      const element = sticky.current;
      if (!element) return;
      const stop = parseFloat(getComputedStyle(element).top) || 0;
      setStuck(element.getBoundingClientRect().top <= stop + 1);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [box]);

  useLayoutEffect(() => {
    const anchor = document.getElementById("logo-anchor");
    if (!anchor) return;

    const measure = () => {
      const { x, y } = documentPosition(anchor);
      setBox((current) =>
        current && current.x === x && current.y === y && current.width === anchor.offsetWidth
          ? current
          : { x, y, width: anchor.offsetWidth },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(anchor);
    observer.observe(document.body);
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.logoRail}>
      {box && (
        <div
          className={`${styles.logoSticky} ${stuck ? styles.logoStuck : ""}`}
          ref={sticky}
          style={{ marginLeft: box.x, marginTop: box.y, width: box.width }}
        >
          <Reveal delay={0.9} kind="sticker" rotate={-10}>
            <a aria-label={goHome} href="#inicio" onClick={scrollToTop}>
              <Image
                alt={alt}
                className={`${styles.stickerImage} ${styles.axImage}`}
                height={309}
                priority
                sizes={sizes}
                src="/sticker-ax.webp"
                width={454}
              />
            </a>
          </Reveal>
        </div>
      )}
    </div>
  );
}
