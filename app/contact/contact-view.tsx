"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  type FocusEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { MagneticTitle } from "../components/magnetic-title";
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

type NoteTakingMode = "idle" | "ready" | "writing";

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

function NoteTakingCharacter({
  mode,
  reducedMotion,
}: {
  mode: NoteTakingMode;
  reducedMotion: boolean;
}) {
  const modeLabel = {
    idle: "Personaje esperando con una libreta",
    ready: "Personaje atento y listo para tomar nota",
    writing: "Personaje escribiendo en su libreta",
  }[mode];

  return (
    <motion.figure
      className="contact-note-scene"
      data-mode={mode}
      role="img"
      aria-label={modeLabel}
      initial={reducedMotion ? false : { opacity: 0, y: "1.5rem" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0.15 : 0.72,
        delay: reducedMotion ? 0 : 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className="contact-note-orbit" aria-hidden="true" />

      <svg
        className="contact-note-character"
        viewBox="0 0 520 470"
        fill="none"
        aria-hidden="true"
      >
        <path className="contact-sketch-ground" d="M44 426H476" />
        <ellipse
          className="contact-sketch-shadow"
          cx="271"
          cy="424"
          rx="174"
          ry="13"
        />

        <g className="contact-sketch-person">
          <g className="contact-sketch-body">
            <path d="M198 250c-2 54-2 111-1 170" />
          </g>

          <g className="contact-sketch-head">
            <path
              className="contact-sketch-hair"
              d="M157 78c14-23 43-34 70-21-14-2-28 2-39 10 20-7 40-4 56 8-32-10-59-7-87 3Z"
            />
            <path d="M216 68c-50-8-94 25-101 75-7 53 23 101 75 112 50 10 101-19 114-68 13-49-14-105-88-119Z" />
            <ellipse
              className="contact-sketch-eye contact-sketch-eye-left"
              cx="264"
              cy="151"
              rx="7"
              ry="18"
            />
            <ellipse
              className="contact-sketch-eye contact-sketch-eye-right"
              cx="291"
              cy="159"
              rx="7"
              ry="17"
            />
          </g>

          <g className="contact-sketch-holding-arm">
            <path d="M198 264c-16 21-29 46-40 76 43 5 84 4 124-1" />
            <ellipse
              cx="287"
              cy="338"
              rx="14"
              ry="10"
              transform="rotate(-18 287 338)"
            />
          </g>

          <g className="contact-sketch-paper">
            <path d="M281 338 370 255l104 10-90 75-44 77-109-3 50-76Z" />
            <path
              className="contact-sketch-paper-line contact-sketch-paper-line-one"
              d="M295 349h63"
            />
            <path
              className="contact-sketch-paper-line contact-sketch-paper-line-two"
              d="m282 369 67-1"
            />
            <path
              className="contact-sketch-paper-line contact-sketch-paper-line-three"
              d="m269 389 68-1"
            />
            <path
              className="contact-sketch-paper-line contact-sketch-paper-line-four"
              d="m256 408 60-1"
            />
            <path d="M476 260c7 0 10 6 7 13" />
          </g>

          <g className="contact-sketch-writing-arm">
            <path d="M197 275c24 26 51 46 84 62" />
            <path d="M281 337c17-8 29-24 41-42" />
            <ellipse
              cx="322"
              cy="294"
              rx="13"
              ry="10"
              transform="rotate(-38 322 294)"
            />
            <path className="contact-sketch-pen" d="m308 280 58 55" />
            <path className="contact-sketch-pen-tip" d="m366 335 8 9" />
          </g>
        </g>
      </svg>
    </motion.figure>
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
              <MagneticTitle
                as="h2"
                id="contact-channel-title"
                text="¿Dónde deseas enviarlo?"
                className="m-0 text-[clamp(1.6rem,3.6vw,3.4rem)] leading-[0.94] tracking-[-0.055em]"
              />
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
                  <small className="[overflow-wrap:anywhere] text-[var(--muted)]">
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
                  <small className="[overflow-wrap:anywhere] text-[var(--muted)]">
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
  const [isFieldFocused, setIsFieldFocused] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const writingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteTakingMode: NoteTakingMode = isWriting
    ? "writing"
    : isFieldFocused
      ? "ready"
      : "idle";

  useEffect(
    () => () => {
      if (writingTimeoutRef.current) {
        clearTimeout(writingTimeoutRef.current);
      }
    },
    [],
  );

  const handleFormInput = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    setIsFormReady(Object.keys(validateForm(formData)).length === 0);

    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      setIsWriting(true);

      if (writingTimeoutRef.current) {
        clearTimeout(writingTimeoutRef.current);
      }

      writingTimeoutRef.current = setTimeout(() => {
        setIsWriting(false);
      }, 680);
    }
  };

  const handleFormFocus = (event: FocusEvent<HTMLFormElement>) => {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      setIsFieldFocused(true);
    }
  };

  const handleFormBlur = (event: FocusEvent<HTMLFormElement>) => {
    const nextTarget = event.relatedTarget;

    if (
      nextTarget instanceof Element &&
      event.currentTarget.contains(nextTarget) &&
      (nextTarget instanceof HTMLInputElement ||
        nextTarget instanceof HTMLTextAreaElement)
    ) {
      return;
    }

    setIsFieldFocused(false);
    setIsWriting(false);

    if (writingTimeoutRef.current) {
      clearTimeout(writingTimeoutRef.current);
    }
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
    const message = String(formData.get("message") ?? "").trim();
    const subject = `Consulta desde el portafolio — ${name}`;
    const body = [
      `Hola, soy ${name}.`,
      `Correo de contacto: ${senderEmail}`,
      "",
      message,
    ].join("\n");

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
      <div className="contact-form-layout grid min-w-0 gap-[clamp(1.25rem,3vw,3rem)] lg:grid-cols-2 lg:items-stretch">
        <motion.form
          className="contact-form-surface grid h-full w-full min-w-0 content-start gap-[clamp(1.1rem,2vw,1.75rem)] rounded-[clamp(1.25rem,2.4vw,2.25rem)] p-[clamp(1.1rem,2.2vw,2.2rem)] lg:order-2"
          onSubmit={handleSubmit}
          onInput={handleFormInput}
          onFocus={handleFormFocus}
          onBlur={handleFormBlur}
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

          <label className="group/field grid gap-2">
            <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.07em] text-[var(--muted)] uppercase transition-colors duration-300 group-focus-within/field:text-foreground">
              Mensaje
            </span>

            <span className="relative border-b border-[var(--line)] py-[clamp(0.75rem,1.5vw,1rem)] after:absolute after:inset-x-0 after:bottom-[-0.0625rem] after:h-[0.125rem] after:origin-left after:scale-x-0 after:bg-[var(--accent)] after:transition-transform after:duration-300 after:content-[''] group-focus-within/field:after:scale-x-100">
              <textarea
                className="min-h-[clamp(6rem,12vw,8.5rem)] w-full resize-y border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-[var(--subtle)]"
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
                <small className="[overflow-wrap:anywhere] text-[var(--muted)]">
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

        <NoteTakingCharacter
          mode={noteTakingMode}
          reducedMotion={shouldReduceMotion ?? false}
        />
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
      intro="Cuéntame qué necesitas."
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
