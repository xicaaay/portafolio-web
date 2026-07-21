"use client";

import { motion, useReducedMotion } from "motion/react";
import { type FormEvent, useMemo, useState } from "react";
import {
  FiArrowUpRight,
  FiCheck,
  FiMail,
  FiMessageCircle,
  FiSend,
  FiUser,
} from "react-icons/fi";
import { ContentState } from "../components/content-state";
import { SECTION_ITEMS } from "../components/navigation-config";
import { SectionPageShell } from "../components/section-page-shell";
import type {
  ProfileLoadResult,
  PublicProfile,
  PublicSocialLink,
} from "../about-me/about-me.types";

type ContactViewProps = {
  result: ProfileLoadResult;
};

type ContactChannel = "email" | "whatsapp";

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
  channel?: string;
};

function normalizeSocialIdentifier(value: string | null | undefined) {
  return value?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
}

function findWhatsAppLink(profile: PublicProfile): PublicSocialLink | null {
  return (
    profile.socialLinks.find((social) => {
      const candidates = [social.key, social.platform, social.label].map(
        normalizeSocialIdentifier,
      );

      return candidates.includes("whatsapp");
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

function buildWhatsAppComposeUrl(
  social: PublicSocialLink,
  message: string,
) {
  const phone = social.username?.replace(/\D/g, "") ?? "";

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

function validateForm(formData: FormData, channelAvailable: boolean) {
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

  if (!channelAvailable) {
    errors.channel = "El canal seleccionado no está disponible.";
  }

  return errors;
}

function ContactForm({ profile }: { profile: PublicProfile }) {
  const shouldReduceMotion = useReducedMotion();
  const whatsapp = useMemo(() => findWhatsAppLink(profile), [profile]);
  const initialChannel: ContactChannel = profile.publicEmail
    ? "email"
    : "whatsapp";
  const [channel, setChannel] = useState<ContactChannel>(initialChannel);
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const hasEmail = Boolean(profile.publicEmail);
  const hasWhatsApp = Boolean(whatsapp);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    const formData = new FormData(event.currentTarget);
    const channelAvailable =
      channel === "email" ? hasEmail : hasWhatsApp;
    const validationErrors = validateForm(formData, channelAvailable);

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
    const composedMessage = [
      `Hola, soy ${name}.`,
      company ? `Empresa o proyecto: ${company}` : null,
      `Correo de contacto: ${senderEmail}`,
      "",
      message,
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    const targetUrl =
      channel === "email" && profile.publicEmail
        ? buildGmailComposeUrl(profile.publicEmail, subject, composedMessage)
        : whatsapp
          ? buildWhatsAppComposeUrl(whatsapp, composedMessage)
          : null;

    if (!targetUrl) {
      setErrors({ channel: "No existe un canal de contacto disponible." });
      return;
    }

    const openedWindow = window.open(targetUrl, "_blank");

    if (openedWindow) {
      openedWindow.opener = null;
    } else {
      window.location.assign(targetUrl);
    }

    setStatusMessage(
      channel === "email"
        ? "Se abrió Gmail en el navegador con tu mensaje preparado."
        : "Se abrió WhatsApp con tu mensaje preparado.",
    );
  };

  return (
    <div className="grid min-w-0 gap-[clamp(1.25rem,3vw,3rem)] lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
      <motion.aside
        className="grid min-w-0 content-start gap-[clamp(1.5rem,3vw,3rem)] border border-[var(--line)] bg-[var(--surface)] p-[clamp(1.25rem,3vw,3rem)] lg:sticky lg:top-[clamp(1.25rem,3vw,3rem)]"
        initial={shouldReduceMotion ? false : { opacity: 0, x: "-1.5rem" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid gap-4">
          <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
            CONTACTO DIRECTO / 01
          </span>
          <h2 className="m-0 text-[clamp(2rem,4vw,4.5rem)] leading-[0.9] tracking-[-0.055em]">
            Hablemos de tu próxima idea.
          </h2>
          <p className="m-0 text-[clamp(0.92rem,1.1vw,1.08rem)] leading-[1.7] text-[var(--muted)]">
            Completa el formulario una sola vez y elige el canal. El mensaje se
            prepara para enviarlo desde Gmail en el navegador o desde WhatsApp.
          </p>
        </div>

        <div className="grid gap-3">
          {hasEmail && profile.publicEmail && (
            <a
              href={`mailto:${profile.publicEmail}`}
              className="group/direct-link flex min-w-0 items-center gap-4 border border-[var(--line)] bg-background p-4 text-foreground no-underline transition duration-300 hover:-translate-y-[0.2rem] hover:border-foreground focus-visible:-translate-y-[0.2rem] focus-visible:border-foreground"
              data-cursor="action"
            >
              <span
                className="grid size-[2.6rem] shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--accent)] transition-transform duration-300 group-hover/direct-link:scale-115"
                data-blue-icon
              >
                <FiMail aria-hidden="true" />
              </span>
              <span className="grid min-w-0 gap-1">
                <strong className="font-medium">Correo</strong>
                <small className="truncate text-[var(--muted)]">
                  {profile.publicEmail}
                </small>
              </span>
              <FiArrowUpRight className="ml-auto shrink-0 transition-transform duration-300 group-hover/direct-link:translate-x-[0.15rem] group-hover/direct-link:translate-y-[-0.15rem]" aria-hidden="true" />
            </a>
          )}

          {hasWhatsApp && whatsapp && (
            <a
              href={whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/direct-link flex min-w-0 items-center gap-4 border border-[var(--line)] bg-background p-4 text-foreground no-underline transition duration-300 hover:-translate-y-[0.2rem] hover:border-foreground focus-visible:-translate-y-[0.2rem] focus-visible:border-foreground"
              data-cursor="action"
            >
              <span
                className="grid size-[2.6rem] shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--accent)] transition-transform duration-300 group-hover/direct-link:scale-115"
                data-blue-icon
              >
                <FiMessageCircle aria-hidden="true" />
              </span>
              <span className="grid min-w-0 gap-1">
                <strong className="font-medium">WhatsApp</strong>
                <small className="truncate text-[var(--muted)]">
                  {whatsapp.username ?? whatsapp.label}
                </small>
              </span>
              <FiArrowUpRight className="ml-auto shrink-0 transition-transform duration-300 group-hover/direct-link:translate-x-[0.15rem] group-hover/direct-link:translate-y-[-0.15rem]" aria-hidden="true" />
            </a>
          )}
        </div>
      </motion.aside>

      <motion.form
        className="grid min-w-0 gap-[clamp(1.25rem,2.5vw,2rem)] border border-[var(--line)] bg-background p-[clamp(1.25rem,3vw,3rem)]"
        onSubmit={handleSubmit}
        noValidate
        initial={shouldReduceMotion ? false : { opacity: 0, y: "1.5rem" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
            MENSAJE / 02
          </span>
          <span className="font-mono text-[clamp(0.54rem,0.62vw,0.68rem)] tracking-[0.08em] text-[var(--muted)] uppercase">
            CAMPOS REQUERIDOS: NOMBRE, CORREO Y MENSAJE
          </span>
        </div>

        <fieldset className="grid gap-3 border-0 p-0">
          <legend className="mb-3 font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.08em] text-[var(--muted)] uppercase">
            Elige el canal de salida
          </legend>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className={`group/channel flex cursor-pointer items-center gap-4 border p-4 text-left transition duration-300 ${
                channel === "email"
                  ? "border-foreground bg-foreground text-background"
                  : "border-[var(--line)] bg-[var(--surface)] text-foreground hover:border-foreground"
              } ${!hasEmail ? "cursor-not-allowed opacity-35" : ""}`}
              onClick={() => hasEmail && setChannel("email")}
              disabled={!hasEmail}
              aria-pressed={channel === "email"}
              data-cursor={hasEmail ? "action" : undefined}
            >
              <FiMail
                className={`size-[1.2rem] transition-transform duration-300 group-hover/channel:scale-125 ${
                  channel === "email" ? "text-background" : "text-[var(--accent)]"
                }`}
                aria-hidden="true"
                data-blue-icon={channel !== "email" ? true : undefined}
              />
              <span className="grid gap-1">
                <strong className="font-medium">Correo en navegador</strong>
                <small className="opacity-70">Abrir Gmail con el mensaje</small>
              </span>
            </button>

            <button
              type="button"
              className={`group/channel flex cursor-pointer items-center gap-4 border p-4 text-left transition duration-300 ${
                channel === "whatsapp"
                  ? "border-foreground bg-foreground text-background"
                  : "border-[var(--line)] bg-[var(--surface)] text-foreground hover:border-foreground"
              } ${!hasWhatsApp ? "cursor-not-allowed opacity-35" : ""}`}
              onClick={() => hasWhatsApp && setChannel("whatsapp")}
              disabled={!hasWhatsApp}
              aria-pressed={channel === "whatsapp"}
              data-cursor={hasWhatsApp ? "action" : undefined}
            >
              <FiMessageCircle
                className={`size-[1.2rem] transition-transform duration-300 group-hover/channel:scale-125 ${
                  channel === "whatsapp"
                    ? "text-background"
                    : "text-[var(--accent)]"
                }`}
                aria-hidden="true"
                data-blue-icon={channel !== "whatsapp" ? true : undefined}
              />
              <span className="grid gap-1">
                <strong className="font-medium">WhatsApp</strong>
                <small className="opacity-70">Abrir el chat con el mensaje</small>
              </span>
            </button>
          </div>

          {errors.channel && (
            <p className="m-0 text-sm text-[var(--accent)]" role="alert">
              {errors.channel}
            </p>
          )}
        </fieldset>

        <div className="grid gap-[clamp(1rem,2vw,1.5rem)] sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.07em] text-[var(--muted)] uppercase">
              Nombre
            </span>
            <span className="group/input flex items-center gap-3 border-b border-[var(--line)] py-3 transition-colors duration-300 focus-within:border-foreground">
              <FiUser
                className="shrink-0 text-[var(--accent)] transition-transform duration-300 group-focus-within/input:scale-125"
                aria-hidden="true"
                data-blue-icon
              />
              <input
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-[var(--subtle)]"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Tu nombre"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
              />
            </span>
            {errors.name && (
              <small id="contact-name-error" className="text-[var(--accent)]">
                {errors.name}
              </small>
            )}
          </label>

          <label className="grid gap-2">
            <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.07em] text-[var(--muted)] uppercase">
              Tu correo
            </span>
            <span className="group/input flex items-center gap-3 border-b border-[var(--line)] py-3 transition-colors duration-300 focus-within:border-foreground">
              <FiMail
                className="shrink-0 text-[var(--accent)] transition-transform duration-300 group-focus-within/input:scale-125"
                aria-hidden="true"
                data-blue-icon
              />
              <input
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-[var(--subtle)]"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="nombre@correo.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
              />
            </span>
            {errors.email && (
              <small id="contact-email-error" className="text-[var(--accent)]">
                {errors.email}
              </small>
            )}
          </label>
        </div>

        <div className="grid gap-[clamp(1rem,2vw,1.5rem)] sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.07em] text-[var(--muted)] uppercase">
              Empresa o proyecto
            </span>
            <input
              className="border-0 border-b border-[var(--line)] bg-transparent py-3 text-foreground outline-none transition-colors duration-300 placeholder:text-[var(--subtle)] focus:border-foreground"
              type="text"
              name="company"
              autoComplete="organization"
              placeholder="Opcional"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.07em] text-[var(--muted)] uppercase">
              Asunto
            </span>
            <input
              className="border-0 border-b border-[var(--line)] bg-transparent py-3 text-foreground outline-none transition-colors duration-300 placeholder:text-[var(--subtle)] focus:border-foreground"
              type="text"
              name="subject"
              placeholder="Opcional"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.07em] text-[var(--muted)] uppercase">
            Mensaje
          </span>
          <textarea
            className="min-h-[clamp(10rem,22vw,17rem)] resize-y border border-[var(--line)] bg-[var(--surface)] p-[clamp(1rem,2vw,1.5rem)] text-foreground outline-none transition-colors duration-300 placeholder:text-[var(--subtle)] focus:border-foreground"
            name="message"
            placeholder="Cuéntame qué necesitas construir, mejorar o integrar."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {errors.message && (
            <small id="contact-message-error" className="text-[var(--accent)]">
              {errors.message}
            </small>
          )}
        </label>

        <div className="flex flex-wrap items-center justify-between gap-5">
          <button
            type="submit"
            className="group/submit inline-flex cursor-pointer items-center gap-4 bg-foreground px-[clamp(1.1rem,2vw,1.5rem)] py-[clamp(0.9rem,1.4vw,1.1rem)] text-background transition duration-300 hover:-translate-y-[0.2rem] hover:bg-[var(--accent)] focus-visible:-translate-y-[0.2rem] focus-visible:bg-[var(--accent)]"
            data-cursor="action"
          >
            Preparar mensaje
            <FiSend className="transition-transform duration-300 group-hover/submit:translate-x-[0.2rem] group-hover/submit:scale-110" aria-hidden="true" />
          </button>

          {statusMessage && (
            <p
              className="m-0 inline-flex items-center gap-3 text-[clamp(0.78rem,0.9vw,0.9rem)] text-[var(--muted)]"
              role="status"
            >
              <span
                className="grid size-[1.5rem] place-items-center rounded-full border border-[var(--line)] text-[var(--accent)]"
                data-blue-icon
              >
                <FiCheck className="size-[0.75rem]" aria-hidden="true" />
              </span>
              {statusMessage}
            </p>
          )}
        </div>
      </motion.form>
    </div>
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
      intro="Un contacto directo, sin pasos innecesarios. Escribe tu mensaje y elige si prefieres continuar desde Gmail en el navegador o mediante WhatsApp."
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
