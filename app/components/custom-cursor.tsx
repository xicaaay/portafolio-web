"use client";

import { useEffect, useRef, useState } from "react";

const MAX_PARTICLES = 56;
const IDLE_DELAY_MS = 220;
const MOVING_EMIT_INTERVAL_MS = 34;
const IDLE_EMIT_INTERVAL_MS = 26;
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
const CURSOR_CONFIGURATION_SELECTOR = [
  "[data-cursor-color]",
  "[data-cursor-tone]",
  "[data-cursor-contrast]",
].join(",");

type Point = {
  x: number;
  y: number;
};

type RgbaColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type Particle = {
  element: HTMLSpanElement | null;
  active: boolean;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  gravity: number;
  drag: number;
  bornAt: number;
  lifetime: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
};

function clampColorChannel(value: number) {
  return Math.min(255, Math.max(0, value));
}

function parseCssColor(value: string): RgbaColor | null {
  const normalized = value.trim().toLowerCase();

  if (!normalized || normalized === "transparent") {
    return null;
  }

  const hexMatch = normalized.match(/^#([\da-f]{3,8})$/i);

  if (hexMatch) {
    const hex = hexMatch[1];
    const expanded =
      hex.length === 3 || hex.length === 4
        ? Array.from(hex, (character) => `${character}${character}`).join("")
        : hex;

    if (expanded.length === 6 || expanded.length === 8) {
      return {
        r: Number.parseInt(expanded.slice(0, 2), 16),
        g: Number.parseInt(expanded.slice(2, 4), 16),
        b: Number.parseInt(expanded.slice(4, 6), 16),
        a:
          expanded.length === 8
            ? Number.parseInt(expanded.slice(6, 8), 16) / 255
            : 1,
      };
    }
  }

  const rgbMatch = normalized.match(
    /^rgba?\(\s*([\d.]+)(?:\s*,\s*|\s+)([\d.]+)(?:\s*,\s*|\s+)([\d.]+)(?:\s*(?:,|\/)\s*([\d.]+%?))?\s*\)$/,
  );

  if (!rgbMatch) {
    return null;
  }

  const alphaValue = rgbMatch[4];
  const alpha = alphaValue
    ? alphaValue.endsWith("%")
      ? Number.parseFloat(alphaValue) / 100
      : Number.parseFloat(alphaValue)
    : 1;

  return {
    r: clampColorChannel(Number.parseFloat(rgbMatch[1])),
    g: clampColorChannel(Number.parseFloat(rgbMatch[2])),
    b: clampColorChannel(Number.parseFloat(rgbMatch[3])),
    a: Math.min(1, Math.max(0, alpha)),
  };
}

function getRelativeLuminance(color: RgbaColor) {
  const convertChannel = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  return (
    convertChannel(color.r) * 0.2126 +
    convertChannel(color.g) * 0.7152 +
    convertChannel(color.b) * 0.0722
  );
}

function interpolate(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}

function randomBetween(minimum: number, maximum: number) {
  return minimum + Math.random() * (maximum - minimum);
}

export function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dotAnchorRef = useRef<HTMLDivElement>(null);
  const particleElementsRef = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const finePointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const updateAvailability = () => {
      setIsEnabled(finePointerQuery.matches && !reducedMotionQuery.matches);
    };

    finePointerQuery.addEventListener("change", updateAvailability);
    reducedMotionQuery.addEventListener("change", updateAvailability);
    updateAvailability();

    return () => {
      finePointerQuery.removeEventListener("change", updateAvailability);
      reducedMotionQuery.removeEventListener("change", updateAvailability);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const root = rootRef.current;
    const dotAnchor = dotAnchorRef.current;

    if (!root || !dotAnchor) {
      return;
    }

    const pointer: Point = { x: -100, y: -100 };
    const previousPointer: Point = { x: -100, y: -100 };
    const pointerVelocity: Point = { x: 0, y: 0 };
    const currentColor: RgbaColor = { r: 9, g: 10, b: 11, a: 1 };
    const targetColor: RgbaColor = { r: 9, g: 10, b: 11, a: 1 };
    const currentEdgeColor: RgbaColor = { r: 243, g: 244, b: 239, a: 1 };
    const targetEdgeColor: RgbaColor = { r: 243, g: 244, b: 239, a: 1 };
    const particles: Particle[] = Array.from(
      { length: MAX_PARTICLES },
      (_, index) => ({
        element: particleElementsRef.current[index] ?? null,
        active: false,
        x: -100,
        y: -100,
        velocityX: 0,
        velocityY: 0,
        gravity: 0,
        drag: 0.95,
        bornAt: 0,
        lifetime: 0,
        opacity: 0,
        rotation: 0,
        rotationSpeed: 0,
      }),
    );
    const colorProbe = document.createElement("span");

    colorProbe.className = "custom-cursor-color-probe";
    colorProbe.setAttribute("aria-hidden", "true");
    root.appendChild(colorProbe);

    let animationFrame = 0;
    let isInteractive = false;
    let isPressed = false;
    let isVisible = false;
    let isInitialized = false;
    let isIdle = false;
    let lastFrameTime = performance.now();
    let lastMoveTime = lastFrameTime;
    let lastPointerSampleTime = lastFrameTime;
    let lastMovingEmissionTime = 0;
    let lastIdleEmissionTime = 0;
    let movementDistance = 0;
    let nextParticleIndex = 0;
    let lastTarget: Element | null = null;

    const resolveCssColor = (
      rawValue: string,
      context: Element,
    ): RgbaColor | null => {
      let value = rawValue.trim();

      if (!value) {
        return null;
      }

      const customPropertyMatch = value.match(
        /^(?:var\(\s*)?(--[\w-]+)(?:\s*\))?$/,
      );

      if (customPropertyMatch) {
        value = window
          .getComputedStyle(context)
          .getPropertyValue(customPropertyMatch[1])
          .trim();
      }

      if (!value || !window.CSS.supports("color", value)) {
        return null;
      }

      colorProbe.style.color = value;
      return parseCssColor(window.getComputedStyle(colorProbe).color);
    };

    const getRootColor = (property: string, fallback: RgbaColor) => {
      const value = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(property);

      return resolveCssColor(value, document.documentElement) ?? fallback;
    };

    const getSurfaceTone = (element: Element | null): "light" | "dark" => {
      let current: Element | null = element;

      while (current) {
        const backgroundColor = parseCssColor(
          window.getComputedStyle(current).backgroundColor,
        );

        if (backgroundColor && backgroundColor.a >= 0.35) {
          return getRelativeLuminance(backgroundColor) >= 0.5
            ? "light"
            : "dark";
        }

        current = current.parentElement;
      }

      return document.documentElement.dataset.theme === "dark"
        ? "dark"
        : "light";
    };

    const setColorTarget = (color: RgbaColor) => {
      targetColor.r = color.r;
      targetColor.g = color.g;
      targetColor.b = color.b;
      targetColor.a = 1;

      const edge =
        getRelativeLuminance(color) >= 0.5
          ? getRootColor("--cursor-on-light", {
              r: 9,
              g: 10,
              b: 11,
              a: 1,
            })
          : getRootColor("--cursor-on-dark", {
              r: 243,
              g: 244,
              b: 239,
              a: 1,
            });

      targetEdgeColor.r = edge.r;
      targetEdgeColor.g = edge.g;
      targetEdgeColor.b = edge.b;
      targetEdgeColor.a = 1;
    };

    const updateColorForTarget = (target: Element | null) => {
      const configuredElement = target?.closest<HTMLElement>(
        CURSOR_CONFIGURATION_SELECTOR,
      );
      const onLight = getRootColor("--cursor-on-light", {
        r: 9,
        g: 10,
        b: 11,
        a: 1,
      });
      const onDark = getRootColor("--cursor-on-dark", {
        r: 243,
        g: 244,
        b: 239,
        a: 1,
      });

      if (configuredElement?.dataset.cursorColor) {
        const explicitColor = resolveCssColor(
          configuredElement.dataset.cursorColor,
          configuredElement,
        );

        if (explicitColor) {
          setColorTarget(explicitColor);
          return;
        }
      }

      const explicitContrast =
        configuredElement?.dataset.cursorContrast?.toLowerCase();

      if (explicitContrast === "light") {
        setColorTarget(onDark);
        return;
      }

      if (explicitContrast === "dark") {
        setColorTarget(onLight);
        return;
      }

      const explicitTone = configuredElement?.dataset.cursorTone?.toLowerCase();

      if (explicitTone === "light") {
        setColorTarget(onLight);
        return;
      }

      if (explicitTone === "dark") {
        setColorTarget(onDark);
        return;
      }

      setColorTarget(getSurfaceTone(target) === "light" ? onLight : onDark);
    };

    const updateTargetState = (eventTarget: EventTarget | null) => {
      const target = eventTarget instanceof Element ? eventTarget : null;

      if (target === lastTarget) {
        return;
      }

      lastTarget = target;
      const nextInteractive = Boolean(target?.closest(INTERACTIVE_SELECTOR));

      if (nextInteractive !== isInteractive) {
        isInteractive = nextInteractive;
        root.classList.toggle("is-interactive", isInteractive);
      }

      updateColorForTarget(target);
    };

    const deactivateParticle = (particle: Particle) => {
      particle.active = false;

      if (particle.element) {
        particle.element.style.opacity = "0";
        particle.element.style.transform =
          "translate3d(-100px, -100px, 0) translate(-50%, -50%) scale(0)";
      }
    };

    const spawnParticle = (time: number, stationary: boolean) => {
      const particle = particles[nextParticleIndex];
      const element = particle.element;

      nextParticleIndex = (nextParticleIndex + 1) % particles.length;

      if (!element) {
        return;
      }

      const speed = Math.hypot(pointerVelocity.x, pointerVelocity.y);
      const directionX = speed > 0.01 ? -pointerVelocity.x / speed : 0;
      const directionY = speed > 0.01 ? -pointerVelocity.y / speed : 0;
      const angle = Math.random() * Math.PI * 2;
      const radialX = Math.cos(angle);
      const radialY = Math.sin(angle);
      const size = stationary
        ? randomBetween(1.6, 4.5)
        : randomBetween(1.3, 3.9);
      const width = size * randomBetween(0.72, 1.25);
      const height = size * randomBetween(0.72, 1.3);
      const offsetRadius = stationary
        ? randomBetween(2.5, 7)
        : randomBetween(1, 4.5);

      particle.active = true;
      particle.x =
        pointer.x +
        (stationary ? radialX : directionX) * offsetRadius +
        randomBetween(-1.4, 1.4);
      particle.y =
        pointer.y +
        (stationary ? radialY : directionY) * offsetRadius +
        randomBetween(-1.4, 1.4);
      particle.velocityX = stationary
        ? radialX * randomBetween(0.035, 0.115) + randomBetween(-0.025, 0.025)
        : directionX * randomBetween(0.045, 0.15) +
          radialX * randomBetween(0.01, 0.055);
      particle.velocityY = stationary
        ? radialY * randomBetween(0.035, 0.115) + randomBetween(-0.02, 0.035)
        : directionY * randomBetween(0.045, 0.15) +
          radialY * randomBetween(0.01, 0.055);
      particle.gravity = stationary
        ? randomBetween(0.00008, 0.00022)
        : randomBetween(0.00004, 0.00014);
      particle.drag = stationary
        ? randomBetween(0.955, 0.978)
        : randomBetween(0.94, 0.968);
      particle.bornAt = time;
      particle.lifetime = stationary
        ? randomBetween(500, 880)
        : randomBetween(360, 700);
      particle.opacity = stationary
        ? randomBetween(0.45, 0.78)
        : randomBetween(0.34, 0.66);
      particle.rotation = randomBetween(0, 180);
      particle.rotationSpeed = randomBetween(-0.18, 0.18);

      element.style.width = `${width.toFixed(2)}px`;
      element.style.height = `${height.toFixed(2)}px`;
      element.style.borderRadius = `${randomBetween(38, 62).toFixed(0)}% ${randomBetween(38, 62).toFixed(0)}% ${randomBetween(38, 62).toFixed(0)}% ${randomBetween(38, 62).toFixed(0)}%`;
      element.style.opacity = particle.opacity.toFixed(3);
      element.style.transform = `translate3d(${particle.x.toFixed(2)}px, ${particle.y.toFixed(2)}px, 0) translate(-50%, -50%) rotate(${particle.rotation.toFixed(2)}deg) scale(1)`;
    };

    const initializePointer = (x: number, y: number, time: number) => {
      pointer.x = x;
      pointer.y = y;
      previousPointer.x = x;
      previousPointer.y = y;
      lastMoveTime = time;
      lastPointerSampleTime = time;
      dotAnchor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      isInitialized = true;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!event.isPrimary || event.pointerType === "touch") {
        return;
      }

      const time = performance.now();

      if (!isInitialized) {
        initializePointer(event.clientX, event.clientY, time);
      }

      const deltaX = event.clientX - previousPointer.x;
      const deltaY = event.clientY - previousPointer.y;
      const sampleDuration = Math.max(8, time - lastPointerSampleTime);
      const instantVelocityX = deltaX / sampleDuration;
      const instantVelocityY = deltaY / sampleDuration;

      pointerVelocity.x = interpolate(pointerVelocity.x, instantVelocityX, 0.42);
      pointerVelocity.y = interpolate(pointerVelocity.y, instantVelocityY, 0.42);
      movementDistance += Math.hypot(deltaX, deltaY);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      previousPointer.x = pointer.x;
      previousPointer.y = pointer.y;
      lastPointerSampleTime = time;
      lastMoveTime = time;
      updateTargetState(event.target);

      if (isIdle) {
        isIdle = false;
        root.classList.remove("is-idle");
      }

      if (!isVisible) {
        isVisible = true;
        root.classList.add("is-visible");
      }
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (event.isPrimary && event.pointerType !== "touch") {
        updateTargetState(event.target);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.pointerType === "touch" || event.button !== 0) {
        return;
      }

      isPressed = true;
      root.classList.add("is-pressed");
    };

    const releasePointer = () => {
      isPressed = false;
      root.classList.remove("is-pressed");
    };

    const hidePointer = () => {
      isVisible = false;
      isInteractive = false;
      isPressed = false;
      isInitialized = false;
      isIdle = false;
      movementDistance = 0;
      pointerVelocity.x = 0;
      pointerVelocity.y = 0;
      lastTarget = null;
      root.classList.remove(
        "is-visible",
        "is-interactive",
        "is-pressed",
        "is-idle",
      );
      particles.forEach(deactivateParticle);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        hidePointer();
      }
    };

    const animate = (time: number) => {
      const deltaTime = Math.min(32, Math.max(8, time - lastFrameTime));
      const frameRatio = deltaTime / 16.667;

      lastFrameTime = time;

      if (isInitialized) {
        dotAnchor.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

        const shouldBeIdle =
          isVisible && !isPressed && time - lastMoveTime >= IDLE_DELAY_MS;

        if (shouldBeIdle !== isIdle) {
          isIdle = shouldBeIdle;
          root.classList.toggle("is-idle", isIdle);

          if (isIdle) {
            lastIdleEmissionTime = 0;
            pointerVelocity.x *= 0.3;
            pointerVelocity.y *= 0.3;
          }
        }

        if (isVisible && isIdle) {
          if (time - lastIdleEmissionTime >= IDLE_EMIT_INTERVAL_MS) {
            spawnParticle(time, true);

            if (Math.random() > 0.7) {
              spawnParticle(time, true);
            }

            lastIdleEmissionTime = time;
          }
        } else if (
          isVisible &&
          movementDistance >= 3 &&
          time - lastMovingEmissionTime >= MOVING_EMIT_INTERVAL_MS
        ) {
          const emissionCount = Math.min(
            3,
            Math.max(1, Math.floor(movementDistance / 9)),
          );

          for (let index = 0; index < emissionCount; index += 1) {
            spawnParticle(time, false);
          }

          movementDistance = Math.max(0, movementDistance - emissionCount * 8);
          lastMovingEmissionTime = time;
        }
      }

      particles.forEach((particle) => {
        if (!particle.active || !particle.element) {
          return;
        }

        const progress = (time - particle.bornAt) / particle.lifetime;

        if (progress >= 1) {
          deactivateParticle(particle);
          return;
        }

        const dragAmount = Math.pow(particle.drag, frameRatio);
        const remaining = 1 - progress;
        const scale = 0.28 + remaining * 0.72;
        const opacity = particle.opacity * Math.pow(remaining, 1.7);

        particle.velocityX *= dragAmount;
        particle.velocityY = particle.velocityY * dragAmount + particle.gravity * deltaTime;
        particle.x += particle.velocityX * deltaTime;
        particle.y += particle.velocityY * deltaTime;
        particle.rotation += particle.rotationSpeed * deltaTime;

        particle.element.style.opacity = opacity.toFixed(3);
        particle.element.style.transform = `translate3d(${particle.x.toFixed(2)}px, ${particle.y.toFixed(2)}px, 0) translate(-50%, -50%) rotate(${particle.rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });

      const colorAmount = 1 - Math.pow(1 - 0.17, frameRatio);

      currentColor.r = interpolate(currentColor.r, targetColor.r, colorAmount);
      currentColor.g = interpolate(currentColor.g, targetColor.g, colorAmount);
      currentColor.b = interpolate(currentColor.b, targetColor.b, colorAmount);
      currentEdgeColor.r = interpolate(
        currentEdgeColor.r,
        targetEdgeColor.r,
        colorAmount,
      );
      currentEdgeColor.g = interpolate(
        currentEdgeColor.g,
        targetEdgeColor.g,
        colorAmount,
      );
      currentEdgeColor.b = interpolate(
        currentEdgeColor.b,
        targetEdgeColor.b,
        colorAmount,
      );

      root.style.setProperty(
        "--cursor-current-color",
        `${currentColor.r.toFixed(1)} ${currentColor.g.toFixed(1)} ${currentColor.b.toFixed(1)}`,
      );
      root.style.setProperty(
        "--cursor-current-edge",
        `${currentEdgeColor.r.toFixed(1)} ${currentEdgeColor.g.toFixed(1)} ${currentEdgeColor.b.toFixed(1)}`,
      );

      animationFrame = window.requestAnimationFrame(animate);
    };

    const themeObserver = new MutationObserver(() => {
      updateColorForTarget(lastTarget);
    });

    updateColorForTarget(null);
    currentColor.r = targetColor.r;
    currentColor.g = targetColor.g;
    currentColor.b = targetColor.b;
    currentEdgeColor.r = targetEdgeColor.r;
    currentEdgeColor.g = targetEdgeColor.g;
    currentEdgeColor.b = targetEdgeColor.b;

    root.style.setProperty(
      "--cursor-current-color",
      `${currentColor.r} ${currentColor.g} ${currentColor.b}`,
    );
    root.style.setProperty(
      "--cursor-current-edge",
      `${currentEdgeColor.r} ${currentEdgeColor.g} ${currentEdgeColor.b}`,
    );

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", releasePointer, { passive: true });
    window.addEventListener("pointercancel", releasePointer, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("blur", hidePointer);

    animationFrame = window.requestAnimationFrame(animate);
    document.documentElement.classList.add("custom-cursor-enabled");

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", releasePointer);
      window.removeEventListener("pointercancel", releasePointer);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", hidePointer);
      window.cancelAnimationFrame(animationFrame);
      themeObserver.disconnect();
      particles.forEach(deactivateParticle);
      colorProbe.remove();
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div ref={rootRef} className="custom-cursor" aria-hidden="true">
      <div ref={dotAnchorRef} className="custom-cursor-dot-anchor">
        <span className="custom-cursor-dot" />
      </div>

      <div className="custom-cursor-particles">
        {Array.from({ length: MAX_PARTICLES }, (_, index) => (
          <span
            key={index}
            ref={(element) => {
              particleElementsRef.current[index] = element;
            }}
            className="custom-cursor-particle"
          />
        ))}
      </div>
    </div>
  );
}
