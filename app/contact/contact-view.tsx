"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiCheck,
  FiMail,
  FiMessageCircle,
  FiSend,
  FiUser,
  FiX,
} from "react-icons/fi";
import type {
  ProfileLoadResult,
  PublicProfile,
  PublicSocialLink,
} from "../about-me/about-me.types";
import { ContentState } from "../components/content-state";
import { SECTION_ITEMS } from "../components/navigation-config";
import { SectionPageShell } from "../components/section-page-shell";

type ContactViewProps = {
  result: ProfileLoadResult;
};

type ContactChannel = "email" | "whatsapp";

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

type PreparedMessage = {
  subject: string;
  body: string;
};

function normalizeSocialIdentifier(value: string | null | undefined) {
  return value?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
}

function isWhatsAppUrl(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    return (
      hostname === "wa.me" ||
      hostname.endsWith(".wa.me") ||
      hostname.includes("whatsapp.com")
    );
  } catch {
    return false;
  }
}

// Detecta WhatsApp aunque el enlace use nombres como WhatsApp Business o una URL directa.
function findWhatsAppLink(profile: PublicProfile): PublicSocialLink | null {
  return (
    profile.socialLinks.find((social) => {
      const identifiers = [
        social.key,
        social.platform,
        social.label,
        social.iconKey,
      ].map(normalizeSocialIdentifier);

      return (
        identifiers.some((identifier) => identifier.includes("whatsapp")) ||
        isWhatsAppUrl(social.url)
      );
    }) ?? null
  );
}

function buildGmailComposeUrl(
  recipient: string,
  subject: string,
  body: string,
) {
  const url = new URL("https://mail.google.com/mail/");
  url.searchParams.set("view", "cm");
  url.searchParams.set("fs", "1");
  url.searchParams.set("to", recipient);
  url.searchParams.set("su", subject);
  url.searchParams.set("body", body);
  return url.toString();
}

function extractWhatsAppPhone(social: PublicSocialLink) {
  const usernamePhone = social.username?.replace(/\D/g, "") ?? "";

  if (usernamePhone) {
    return usernamePhone;
  }

  try {
    const url = new URL(social.url);
    const queryPhone = url.searchParams.get("phone")?.replace(/\D/g, "") ?? "";

    if (queryPhone) {
      return queryPhone;
    }

    if (url.hostname.toLowerCase().includes("wa.me")) {
      return url.pathname.replace(/\D/g, "");
    }
  } catch {
    return social.url.replace(/\D/g, "");
  }

  return "";
}

function buildWhatsAppComposeUrl(
  social: PublicSocialLink,
  message: string,
) {
  const phone = extractWhatsAppPhone(social);

  if (phone) {
    const url = new URL(`https://wa.me/${phone}`);
    url.searchParams.set("text", message);
    return url.toString();
  }

  try {
    const url = new URL(social.url);
    url.searchParams.set("text", message);
    return url.toString();
  } catch {
    return social.url;
  }
}

function validateForm(formData: FormData) {
  const errors: FormErrors = {};
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) {
    errors.name = "Escribe tu nombre para poder identificarte.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Escribe una dirección de correo válida.";
  }

  if (message.length < 12) {
    errors.message = "Cuéntame un poco más sobre lo que necesitas.";
  }

  return errors;
}

function CursorFollower({ isWatching }: { isWatching: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 105, damping: 17, mass: 0.55 });
  const smoothY = useSpring(pointerY, { stiffness: 105, damping: 17, mass: 0.55 });
  const headX = useTransform(smoothX, [-1, 1], [-13, 13]);
  const headY = useTransform(smoothY, [-1, 1], [-9, 9]);
  const headRotateX = useTransform(smoothY, [-1, 1], [10, -10]);
  const headRotateY = useTransform(smoothX, [-1, 1], [-13, 13]);
  const headRotateZ = useTransform(smoothX, [-1, 1], [-3, 3]);
  const eyesX = useTransform(smoothX, [-1, 1], [-11, 11]);
  const eyesY = useTransform(smoothY, [-1, 1], [-7, 7]);
  const bodyX = useTransform(smoothX, [-1, 1], [-4, 4]);
  const bodyRotate = useTransform(smoothX, [-1, 1], [-1.5, 1.5]);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const followPointer = (event: PointerEvent) => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const bounds = container.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height * 0.34;
      const distanceX = event.clientX - centerX;
      const distanceY = event.clientY - centerY;
      const horizontalReach = Math.max(window.innerWidth * 0.34, 1);
      const verticalReach = Math.max(window.innerHeight * 0.34, 1);
      const normalizedX = Math.max(-1, Math.min(1, distanceX / horizontalReach));
      const normalizedY = Math.max(-1, Math.min(1, distanceY / verticalReach));

      pointerX.set(normalizedX);
      pointerY.set(normalizedY);
    };

    window.addEventListener("pointermove", followPointer, { passive: true });
    return () => window.removeEventListener("pointermove", followPointer);
  }, [pointerX, pointerY, shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      className="relative grid min-h-[clamp(19rem,42vw,34rem)] place-items-center overflow-hidden rounded-[clamp(1.5rem,3vw,3rem)] bg-[color-mix(in_srgb,var(--surface-raised)_45%,transparent)]"
      aria-hidden="true"
    >
      <div className="relative flex h-full w-full items-end justify-center">
        <motion.div
          className="absolute bottom-[43%] z-10 grid size-[clamp(6.25rem,10vw,8.5rem)] place-items-center rounded-full bg-[radial-gradient(circle_at_34%_24%,#414141_0%,#1a1a1a_45%,#070707_100%)] shadow-[inset_-1rem_-1.25rem_2.5rem_rgba(0,0,0,0.48),0_1.5rem_3rem_-1.4rem_rgba(0,0,0,0.75)] [transform-style:preserve-3d]"
          style={
            shouldReduceMotion
              ? undefined
              : {
                  x: headX,
                  y: headY,
                  rotateX: headRotateX,
                  rotateY: headRotateY,
                  rotateZ: headRotateZ,
                  transformPerspective: 650,
                }
          }
          animate={{ scale: isWatching ? 1.055 : 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="flex gap-[clamp(0.8rem,1.5vw,1.15rem)]"
            style={
              shouldReduceMotion
                ? { z: 18 }
                : { x: eyesX, y: eyesY, z: 18 }
            }
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    scaleX: isWatching ? 1.08 : 1,
                    scaleY: isWatching
                      ? [1.08, 1.08, 0.12, 1.08, 1.08]
                      : [1, 1, 0.12, 1, 1],
                  }
            }
            transition={{
              duration: 4.8,
              times: [0, 0.72, 0.755, 0.79, 1],
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {[0, 1].map((eye) => (
              <span
                className="block h-[clamp(1.35rem,2vw,1.75rem)] w-[clamp(1rem,1.5vw,1.3rem)] rounded-full bg-white shadow-[0_0.15rem_0.35rem_rgba(255,255,255,0.45),0_0_1.15rem_rgba(255,255,255,0.42)]"
                key={eye}
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="h-[48%] w-[min(74%,18rem)] rounded-t-[50%] bg-[radial-gradient(circle_at_42%_8%,#303030_0%,#161616_48%,#070707_100%)] shadow-[inset_-2rem_-2rem_4rem_rgba(0,0,0,0.42),0_2rem_5rem_-2.5rem_rgba(0,0,0,0.8)]"
          style={shouldReduceMotion ? undefined : { x: bodyX, rotate: bodyRotate }}
          animate={{ scaleX: isWatching ? 1.025 : 1, y: isWatching ? 2 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <motion.span
        className="pointer-events-none absolute size-[55%] rounded-full bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] blur-[3.5rem]"
        animate={{ opacity: isWatching ? 0.8 : 0.35, scale: isWatching ? 1.08 : 0.92 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

type ContactFieldProps = {
  label: string;
  name: string;
  type?: "text" | "email";
  placeholder: string;
  autoComplete?: string;
  error?: string;
  icon?: "user" | "mail";
};

function ContactField({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  error,
  icon,
}: ContactFieldProps) {
  const errorId = error ? `contact-${name}-error` : undefined;

  return (
    <label className="group/field grid min-w-0 gap-2">
      <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.07em] text-[var(--muted)] uppercase transition-colors duration-300 group-focus-within/field:text-foreground">
        {label}
      </span>

      <span className="relative flex min-w-0 items-center gap-3 border-b border-[var(--line)] py-[clamp(0.75rem,1.5vw,1rem)] after:absolute after:inset-x-0 after:bottom-[-0.0625rem] after:h-[0.125rem] after:origin-left after:scale-x-0 after:bg-[var(--accent)] after:transition-transform after:duration-300 after:content-[''] group-focus-within/field:after:scale-x-100">
        {icon === "user" && (
          <FiUser
            className="shrink-0 text-[var(--accent)] transition-transform duration-300 group-focus-within/field:scale-115"
            aria-hidden="true"
            data-blue-icon
          />
        )}

        {icon === "mail" && (
          <FiMail
            className="shrink-0 text-[var(--accent)] transition-transform duration-300 group-focus-within/field:scale-115"
            aria-hidden="true"
            data-blue-icon
          />
        )}

        <input
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-[var(--subtle)]"
          type={type}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        />
      </span>

      {error && (
        <small id={errorId} className="text-[var(--accent)]">
          {error}
        </small>
      )}
    </label>
  );
}

type ChannelDialogProps = {
  open: boolean;
  preparedMessage: PreparedMessage | null;
  publicEmail: string | null;
  whatsapp: PublicSocialLink | null;
  onClose: () => void;
  onSelect: (channel: ContactChannel) => void;
};

function ChannelDialog({
  open,
  preparedMessage,
  publicEmail,
  whatsapp,
  onClose,
  onSelect,
}: ChannelDialogProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open && preparedMessage && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto bg-black/45 p-[clamp(1rem,4vw,3rem)] backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-channel-title"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className="relative grid w-full max-w-[46rem] gap-[clamp(1.5rem,3vw,2.5rem)] overflow-hidden rounded-[clamp(1.5rem,3vw,2.75rem)] bg-[color-mix(in_srgb,var(--surface-raised)_94%,transparent)] p-[clamp(1.25rem,4vw,3rem)] text-foreground shadow-[0_3rem_8rem_-3rem_rgba(0,0,0,0.72)] backdrop-blur-2xl"
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: "1.5rem", scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "1rem", scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            data-cursor-tone="auto"
          >
            <motion.span
              className="pointer-events-none absolute -right-[12%] -top-[35%] size-[clamp(12rem,30vw,24rem)] rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] blur-[clamp(3rem,8vw,7rem)]"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { scale: [0.9, 1.12, 0.9], opacity: [0.35, 0.72, 0.35] }
              }
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />

            <button
              type="button"
              className="absolute right-[clamp(1rem,2.5vw,1.75rem)] top-[clamp(1rem,2.5vw,1.75rem)] z-10 grid size-[clamp(2.5rem,4vw,3rem)] cursor-pointer place-items-center rounded-full bg-background/65 text-foreground shadow-[0_0.75rem_2rem_-1rem_rgba(0,0,0,0.55)] backdrop-blur-lg transition duration-300 hover:rotate-90 hover:scale-105 focus-visible:rotate-90 focus-visible:scale-105"
              onClick={onClose}
              aria-label="Cerrar selección de canal"
              data-cursor="action"
            >
              <FiX aria-hidden="true" />
            </button>

            <div className="relative z-[1] grid max-w-[34rem] gap-3 pr-[clamp(2.5rem,6vw,4rem)]">
              <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.1em] text-[var(--accent)] uppercase">
                MENSAJE PREPARADO
              </span>
              <h2
                id="contact-channel-title"
                className="m-0 text-[clamp(2rem,5vw,4.75rem)] leading-[0.92] tracking-[-0.055em]"
              >
                ¿Dónde deseas enviarlo?
              </h2>
            </div>

            <div className="relative z-[1] grid gap-6 sm:grid-cols-2">
              <button
                type="button"
                className="group/channel grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-4 bg-transparent p-0 text-left text-foreground disabled:cursor-not-allowed disabled:opacity-35"
                onClick={() => onSelect("email")}
                disabled={!publicEmail}
                data-cursor={publicEmail ? "action" : undefined}
              >
                <span className="grid size-[3rem] shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] text-foreground transition-colors duration-300 group-hover/channel:bg-foreground group-hover/channel:text-background">
                  <FiMail className="transition-transform duration-300 group-hover/channel:scale-110" aria-hidden="true" />
                </span>

                <span className="grid min-w-0 gap-1">
                  <strong className="font-medium text-foreground">
                    Gmail
                  </strong>
                  <small className="truncate text-[var(--muted)]">
                    Abrir el correo en el navegador
                  </small>
                </span>

                <FiArrowUpRight className="shrink-0 transition-transform duration-300 group-hover/channel:translate-x-1 group-hover/channel:-translate-y-1" aria-hidden="true" />
              </button>

              <button
                type="button"
                className="group/channel grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-4 bg-transparent p-0 text-left text-foreground disabled:cursor-not-allowed disabled:opacity-35"
                onClick={() => onSelect("whatsapp")}
                disabled={!whatsapp}
                data-cursor={whatsapp ? "action" : undefined}
              >
                <span className="grid size-[3rem] shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] text-foreground transition-colors duration-300 group-hover/channel:bg-foreground group-hover/channel:text-background">
                  <FiMessageCircle className="transition-transform duration-300 group-hover/channel:scale-110" aria-hidden="true" />
                </span>

                <span className="grid min-w-0 gap-1">
                  <strong className="font-medium text-foreground">
                    WhatsApp
                  </strong>
                  <small className="truncate text-[var(--muted)]">
                    Abrir el chat con el mensaje listo
                  </small>
                </span>

                <FiArrowUpRight className="shrink-0 transition-transform duration-300 group-hover/channel:translate-x-1 group-hover/channel:-translate-y-1" aria-hidden="true" />
              </button>
            </div>

            {(!publicEmail || !whatsapp) && (
              <p className="relative z-[1] m-0 text-sm text-[var(--muted)]">
                Los canales sin información pública aparecen deshabilitados.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContactForm({ profile }: { profile: PublicProfile }) {
  const shouldReduceMotion = useReducedMotion();
  const whatsapp = useMemo(() => findWhatsAppLink(profile), [profile]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [preparedMessage, setPreparedMessage] = useState<PreparedMessage | null>(
    null,
  );
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const [isSubmitActive, setIsSubmitActive] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);

  const handleFormInput = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    setIsFormReady(Object.keys(validateForm(formData)).length === 0);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    const formData = new FormData(event.currentTarget);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const name = String(formData.get("name") ?? "").trim();
    const senderEmail = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const subjectInput = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = subjectInput || `Consulta desde el portafolio — ${name}`;
    const body = [
      `Hola, soy ${name}.`,
      company ? `Empresa o proyecto: ${company}` : null,
      `Correo de contacto: ${senderEmail}`,
      "",
      message,
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    // La elección del canal ocurre después de validar y preparar el mensaje.
    setPreparedMessage({ subject, body });
    setIsChannelDialogOpen(true);
  };

  const handleChannelSelect = (channel: ContactChannel) => {
    if (!preparedMessage) {
      return;
    }

    const targetUrl =
      channel === "email" && profile.publicEmail
        ? buildGmailComposeUrl(
            profile.publicEmail,
            preparedMessage.subject,
            preparedMessage.body,
          )
        : channel === "whatsapp" && whatsapp
          ? buildWhatsAppComposeUrl(whatsapp, preparedMessage.body)
          : null;

    if (!targetUrl) {
      return;
    }

    const openedWindow = window.open(targetUrl, "_blank", "noopener,noreferrer");

    if (!openedWindow) {
      window.location.assign(targetUrl);
    }

    setIsChannelDialogOpen(false);
    setStatusMessage(
      channel === "email"
        ? "Tu mensaje quedó listo en Gmail."
        : "Tu mensaje quedó listo en WhatsApp.",
    );
  };

  return (
    <>
      <div className="grid min-w-0 gap-[clamp(1.25rem,3vw,3rem)] lg:grid-cols-[minmax(16rem,0.65fr)_minmax(0,1.35fr)] lg:items-stretch">
        <CursorFollower isWatching={isFormFocused} />

        <motion.form
          className="grid min-w-0 gap-[clamp(1.5rem,3vw,2.5rem)] rounded-[clamp(1.5rem,3vw,3rem)] bg-[color-mix(in_srgb,var(--surface-raised)_58%,transparent)] p-[clamp(1.25rem,3vw,3rem)] shadow-[0_2.5rem_7rem_-4rem_color-mix(in_srgb,var(--foreground)_34%,transparent)] backdrop-blur-2xl"
          onSubmit={handleSubmit}
          onInput={handleFormInput}
          onFocusCapture={() => setIsFormFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsFormFocused(false);
            }
          }}
          noValidate
          initial={shouldReduceMotion ? false : { opacity: 0, y: "1.5rem" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
              MENSAJE
            </span>
            <motion.span
              className="size-[0.5rem] rounded-full bg-[var(--accent)] shadow-[0_0_1.25rem_color-mix(in_srgb,var(--accent)_85%,transparent)]"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { scale: [0.72, 1.28, 0.72], opacity: [0.45, 1, 0.45] }
              }
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              aria-hidden="true"
            />
          </div>

          <div className="grid gap-[clamp(1rem,2vw,1.75rem)] sm:grid-cols-2">
            <ContactField
              label="Nombre"
              name="name"
              placeholder="Tu nombre"
              autoComplete="name"
              error={errors.name}
              icon="user"
            />

            <ContactField
              label="Correo"
              name="email"
              type="email"
              placeholder="nombre@correo.com"
              autoComplete="email"
              error={errors.email}
              icon="mail"
            />
          </div>

          <div className="grid gap-[clamp(1rem,2vw,1.75rem)] sm:grid-cols-2">
            <ContactField
              label="Empresa o proyecto"
              name="company"
              placeholder="Opcional"
              autoComplete="organization"
            />

            <ContactField
              label="Asunto"
              name="subject"
              placeholder="Opcional"
            />
          </div>

          <label className="group/field grid gap-2">
            <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.07em] text-[var(--muted)] uppercase transition-colors duration-300 group-focus-within/field:text-foreground">
              Mensaje
            </span>

            <span className="relative border-b border-[var(--line)] py-[clamp(0.75rem,1.5vw,1rem)] after:absolute after:inset-x-0 after:bottom-[-0.0625rem] after:h-[0.125rem] after:origin-left after:scale-x-0 after:bg-[var(--accent)] after:transition-transform after:duration-300 after:content-[''] group-focus-within/field:after:scale-x-100">
              <textarea
                className="min-h-[clamp(8rem,20vw,13rem)] w-full resize-y border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-[var(--subtle)]"
                name="message"
                placeholder="Cuéntame qué necesitas construir, mejorar o integrar."
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
              />
            </span>

            {errors.message && (
              <small id="contact-message-error" className="text-[var(--accent)]">
                {errors.message}
              </small>
            )}
          </label>

          <div className="flex flex-wrap items-center justify-between gap-5">
            <motion.button
              type="submit"
              className="group/submit grid w-full max-w-[22rem] cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-4 bg-transparent p-0 text-left text-foreground disabled:cursor-not-allowed disabled:opacity-35"
              disabled={!isFormReady}
              onHoverStart={() => setIsSubmitActive(true)}
              onHoverEnd={() => setIsSubmitActive(false)}
              onFocus={() => setIsSubmitActive(true)}
              onBlur={() => setIsSubmitActive(false)}
              data-cursor="action"
            >
              <motion.span
                className={`grid size-[3rem] shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                  isSubmitActive && isFormReady
                    ? "bg-foreground text-background"
                    : "bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] text-foreground"
                }`}
              >
                <motion.span
                  className="inline-flex"
                  initial={{ opacity: 1, x: 0, y: 0 }}
                  animate={
                    isSubmitActive && isFormReady && !shouldReduceMotion
                      ? {
                          opacity: [1, 1, 0, 0, 1],
                          x: [0, "0.15rem", "0.75rem", "-0.35rem", 0],
                          y: [0, "-0.1rem", "-0.65rem", "0.35rem", 0],
                        }
                      : { opacity: 1, x: 0, y: 0 }
                  }
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                    times: [0, 0.22, 0.48, 0.5, 1],
                    repeat:
                      isSubmitActive && isFormReady && !shouldReduceMotion
                        ? Number.POSITIVE_INFINITY
                        : 0,
                    repeatDelay: 0.18,
                  }}
                  aria-hidden="true"
                >
                  <FiSend />
                </motion.span>
              </motion.span>

              <span className="grid min-w-0 gap-1">
                <strong className="font-medium text-foreground">
                  Enviar mensaje
                </strong>
                <small className="truncate text-[var(--muted)]">
                  Elegir Gmail o WhatsApp
                </small>
              </span>

              <FiArrowUpRight
                className={`shrink-0 transition-transform duration-300 ${
                  isSubmitActive && isFormReady
                    ? "translate-x-1 -translate-y-1"
                    : ""
                }`}
                aria-hidden="true"
              />
            </motion.button>

            <AnimatePresence mode="wait">
              {statusMessage && (
                <motion.p
                  key={statusMessage}
                  className="m-0 inline-flex items-center gap-3 text-[clamp(0.78rem,0.9vw,0.9rem)] text-[var(--muted)]"
                  role="status"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: "0.5rem" }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: "-0.35rem" }}
                >
                  <span
                    className="grid size-[1.75rem] place-items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent)]"
                    data-blue-icon
                  >
                    <FiCheck className="size-[0.8rem]" aria-hidden="true" />
                  </span>
                  {statusMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </div>

      <ChannelDialog
        open={isChannelDialogOpen}
        preparedMessage={preparedMessage}
        publicEmail={profile.publicEmail}
        whatsapp={whatsapp}
        onClose={() => setIsChannelDialogOpen(false)}
        onSelect={handleChannelSelect}
      />
    </>
  );
}

export function ContactView({ result }: ContactViewProps) {
  const hasContactChannels =
    result.status === "success" &&
    Boolean(result.profile.publicEmail || findWhatsAppLink(result.profile));

  return (
    <SectionPageShell
      section={SECTION_ITEMS[4]}
      eyebrow="CONVERSEMOS"
      intro="Cuéntame qué necesitas. Al preparar el mensaje podrás elegir entre Gmail y WhatsApp sin volver a escribir nada."
    >
      {result.status === "success" && hasContactChannels && (
        <ContactForm profile={result.profile} />
      )}

      {result.status === "success" && !hasContactChannels && (
        <ContentState
          type="empty"
          title="Aún no hay canales de contacto públicos."
          message="Agrega un correo público o un enlace activo de WhatsApp desde el administrador para habilitar el formulario."
        />
      )}

      {result.status === "empty" && (
        <ContentState
          type="empty"
          title="El perfil todavía no tiene datos públicos."
          message="Cuando el perfil principal incluya información de contacto, esta sección se habilitará automáticamente."
        />
      )}

      {result.status === "error" && (
        <ContentState
          type="error"
          title="No pudimos cargar los canales de contacto."
          message={result.message}
        />
      )}
    </SectionPageShell>
  );
}
