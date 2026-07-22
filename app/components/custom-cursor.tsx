"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  '[role="button"]',
  "[data-cursor-interactive]",
  "[data-cursor]",
].join(",");

const CONFIG_SELECTOR = [
  "[data-cursor-color]",
  "[data-cursor-tone]",
  "[data-cursor-contrast]",
].join(",");

type Point = { x: number; y: number };
type Color = { r: number; g: number; b: number };

function parseRgb(value: string): Color | null {
  const match = value.match(/rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/);

  return match
    ? {
        r: Number.parseFloat(match[1]),
        g: Number.parseFloat(match[2]),
        b: Number.parseFloat(match[3]),
      }
    : null;
}

function luminance({ r, g, b }: Color) {
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  return channel(r) * 0.2126 + channel(g) * 0.7152 + channel(b) * 0.0722;
}

function interpolate(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}

export function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateAvailability = () => {
      setIsEnabled(finePointer.matches && !reducedMotion.matches);
    };

    finePointer.addEventListener("change", updateAvailability);
    reducedMotion.addEventListener("change", updateAvailability);
    updateAvailability();

    return () => {
      finePointer.removeEventListener("change", updateAvailability);
      reducedMotion.removeEventListener("change", updateAvailability);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return;

    const pointer: Point = { x: -100, y: -100 };
    const follower: Point = { x: -100, y: -100 };
    const currentColor: Color = { r: 9, g: 10, b: 11 };
    const targetColor: Color = { r: 9, g: 10, b: 11 };
    const colorProbe = document.createElement("span");
    colorProbe.className = "custom-cursor-color-probe";
    root.appendChild(colorProbe);

    let frame = 0;
    let lastFrameTime = performance.now();
    let initialized = false;
    let lastTarget: Element | null = null;

    const resolveColor = (value: string, context: Element) => {
      let resolved = value.trim();
      const property = resolved.match(/^(?:var\(\s*)?(--[\w-]+)(?:\s*\))?$/)?.[1];

      if (property) {
        resolved = getComputedStyle(context).getPropertyValue(property).trim();
      }
      if (!resolved || !CSS.supports("color", resolved)) return null;

      colorProbe.style.color = resolved;
      return parseRgb(getComputedStyle(colorProbe).color);
    };

    const rootColor = (property: string, fallback: Color) =>
      resolveColor(
        getComputedStyle(document.documentElement).getPropertyValue(property),
        document.documentElement,
      ) ?? fallback;

    const setTargetColor = (color: Color) => {
      targetColor.r = color.r;
      targetColor.g = color.g;
      targetColor.b = color.b;
    };

    const surfaceTone = (element: Element | null) => {
      let current = element;

      while (current) {
        const styles = getComputedStyle(current);
        const background = parseRgb(styles.backgroundColor);
        const alpha = Number.parseFloat(styles.backgroundColor.split(",")[3] ?? "1");

        if (background && alpha >= 0.35) {
          return luminance(background) >= 0.5 ? "light" : "dark";
        }
        current = current.parentElement;
      }

      return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    };

    const updateColor = (target: Element | null) => {
      const configured = target?.closest<HTMLElement>(CONFIG_SELECTOR);
      const onLight = rootColor("--cursor-on-light", { r: 9, g: 10, b: 11 });
      const onDark = rootColor("--cursor-on-dark", { r: 243, g: 244, b: 239 });
      const explicit = configured?.dataset.cursorColor
        ? resolveColor(configured.dataset.cursorColor, configured)
        : null;

      if (explicit) {
        setTargetColor(explicit);
        return;
      }

      const contrast = configured?.dataset.cursorContrast?.toLowerCase();
      const tone = configured?.dataset.cursorTone?.toLowerCase();

      if (contrast === "light" || tone === "dark") setTargetColor(onDark);
      else if (contrast === "dark" || tone === "light") setTargetColor(onLight);
      else setTargetColor(surfaceTone(target) === "light" ? onLight : onDark);
    };

    const updateTarget = (eventTarget: EventTarget | null) => {
      const target = eventTarget instanceof Element ? eventTarget : null;
      if (target === lastTarget) return;

      lastTarget = target;
      root.classList.toggle(
        "is-interactive",
        Boolean(target?.closest(INTERACTIVE_SELECTOR)),
      );
      updateColor(target);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!event.isPrimary || event.pointerType === "touch") return;

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

      if (!initialized) {
        follower.x = pointer.x;
        follower.y = pointer.y;
        ring.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
        initialized = true;
      }

      updateTarget(event.target);
      root.classList.add("is-visible");
    };

    const handlePointerOver = (event: PointerEvent) => updateTarget(event.target);
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button === 0) root.classList.add("is-pressed");
    };
    const handlePointerUp = () => root.classList.remove("is-pressed");
    const hidePointer = () => {
      root.classList.remove("is-visible", "is-interactive", "is-pressed");
      initialized = false;
      lastTarget = null;
    };
    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) hidePointer();
    };

    const animate = (time: number) => {
      const frameRatio = Math.min(32, Math.max(8, time - lastFrameTime)) / 16.667;
      const followAmount = 1 - Math.pow(0.82, frameRatio);
      const colorAmount = 1 - Math.pow(0.83, frameRatio);
      lastFrameTime = time;

      if (initialized) {
        follower.x = interpolate(follower.x, pointer.x, followAmount);
        follower.y = interpolate(follower.y, pointer.y, followAmount);
        ring.style.transform = `translate3d(${follower.x.toFixed(2)}px, ${follower.y.toFixed(2)}px, 0)`;
      }

      currentColor.r = interpolate(currentColor.r, targetColor.r, colorAmount);
      currentColor.g = interpolate(currentColor.g, targetColor.g, colorAmount);
      currentColor.b = interpolate(currentColor.b, targetColor.b, colorAmount);
      root.style.setProperty(
        "--cursor-current-color",
        `${currentColor.r.toFixed(1)} ${currentColor.g.toFixed(1)} ${currentColor.b.toFixed(1)}`,
      );

      frame = requestAnimationFrame(animate);
    };

    const themeObserver = new MutationObserver(() => updateColor(lastTarget));
    updateColor(null);
    Object.assign(currentColor, targetColor);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", hidePointer, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("blur", hidePointer);
    document.documentElement.classList.add("custom-cursor-enabled");
    frame = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", hidePointer);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", hidePointer);
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      colorProbe.remove();
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div ref={rootRef} className="custom-cursor" aria-hidden="true">
      <span ref={ringRef} className="custom-cursor-ring" />
      <span ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
}
