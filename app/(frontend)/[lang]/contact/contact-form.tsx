"use client";

import { useRef, useState, type FormEvent } from "react";

import { format, type Dictionary } from "../../../../lib/i18n/dictionaries";
import styles from "./contact-form.module.css";

type Field = "name" | "email" | "message";

type ContactFormProps = {
  dict: Dictionary["form"];
  /* Destino del correo. */
  email: string;
  /* Fondo donde va: «light» (texto claro, sobre azul) o «dark» (texto oscuro, sobre papel). */
  tone?: "light" | "dark";
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/*
 * Formulario de contacto sin servidor. Al enviarlo se abre Gmail en el navegador con el
 * destinatario, el asunto y el mensaje ya escritos; la persona solo pulsa «enviar» allí.
 */
export function ContactForm({ dict, email, tone = "light" }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  /* Enlace de respaldo (app de correo) que se ofrece después de abrir Gmail. */
  const [mailto, setMailto] = useState<string | null>(null);
  const toneClass = tone === "light" ? styles.light : styles.dark;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(formRef.current ?? undefined);
    const name = String(data.get("name") ?? "").trim();
    const visitorEmail = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Partial<Record<Field, string>> = {};
    if (name.length < 2) next.name = dict.errorName;
    if (!EMAIL.test(visitorEmail)) next.email = dict.errorEmail;
    if (message.length < 10) next.message = dict.errorMessage;
    setErrors(next);
    setMailto(null);
    if (Object.keys(next).length) return;

    /* El cuerpo del correo es solo el mensaje, sin texto predeterminado. */
    const text = message;

    /* Asunto con el nombre y el correo de quien escribe: «Contactemos — María (maria@correo.com)». */
    const subject = encodeURIComponent(format(dict.emailSubject, { name, email: visitorEmail }));
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${encodeURIComponent(text)}`;

    window.open(gmail, "_blank", "noopener,noreferrer");
    /* En un mailto: los saltos de línea deben ir como CRLF. */
    setMailto(`mailto:${email}?subject=${subject}&body=${encodeURIComponent(text.replace(/\n/g, "\r\n"))}`);
  }

  return (
    <form className={`${styles.form} ${toneClass}`} noValidate onSubmit={handleSubmit} ref={formRef}>
      {Object.keys(errors).length > 0 && (
        <p className={styles.formError} role="alert">
          {dict.errorCheck}
        </p>
      )}

      {(["name", "email", "message"] as const).map((field) => {
        const error = errors[field];
        const id = `contacto-${field}-${tone}`;
        const common = {
          "aria-describedby": error ? `${id}-error` : undefined,
          "aria-invalid": error ? true : undefined,
          className: styles.input,
          id,
          name: field,
        } as const;

        return (
          <div className={styles.field} key={field}>
            <label htmlFor={id}>{dict[field]}</label>
            {field === "message" ? (
              <textarea {...common} maxLength={1500} required rows={4} />
            ) : field === "email" ? (
              <input {...common} autoComplete="email" maxLength={120} required type="email" />
            ) : (
              <input {...common} autoComplete="name" maxLength={80} required type="text" />
            )}
            {error && (
              <p className={styles.fieldError} id={`${id}-error`}>
                {error}
              </p>
            )}
          </div>
        );
      })}

      <button className={styles.submit} type="submit">
        {dict.submit}
        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      </button>

      {mailto && (
        <p className={styles.notice} role="status">
          {dict.notice}{" "}
          <a href={mailto}>{dict.otherMail}</a>
        </p>
      )}
    </form>
  );
}
