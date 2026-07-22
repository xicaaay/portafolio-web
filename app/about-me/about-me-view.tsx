"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { IconType } from "react-icons";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiChevronDown,
  FiLink,
  FiRefreshCw,
} from "react-icons/fi";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import {
  SiBehance,
  SiDevdotto,
  SiDiscord,
  SiDribbble,
  SiFacebook,
  SiGithub,
  SiGitlab,
  SiGmail,
  SiInstagram,
  SiMedium,
  SiStackoverflow,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { FaLink } from "react-icons/fa6";
import { InteractiveSectionTitle } from "../components/interactive-section-title";
import { MagneticTitle } from "../components/magnetic-title";
import { HOME_PATH } from "../components/navigation-config";
import { RouteTransitionLink } from "../components/route-transition-link";
import type {
  ProfileLoadResult,
  PublicProfile,
  PublicSocialLink,
} from "./about-me.types";
import styles from "./about-me.module.css";
import { ProfileBadge } from "./profile-badge";

const easing = [0.22, 1, 0.36, 1] as const;

const SOCIAL_ICONS_BY_KEY: Record<string, IconType> = {
  SiBehance,
  SiDevdotto,
  SiDiscord,
  SiDribbble,
  SiFacebook,
  SiGithub,
  SiGitlab,
  SiGmail,
  SiInstagram,
  SiLinkedin: FaLinkedinIn,
  SiMedium,
  SiStackoverflow,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiWhatsapp,
  SiX,
  SiYoutube,
};

const SOCIAL_ICONS_BY_PLATFORM: Record<string, IconType> = {
  behance: SiBehance,
  devto: SiDevdotto,
  discord: SiDiscord,
  dribbble: SiDribbble,
  email: SiGmail,
  facebook: SiFacebook,
  github: SiGithub,
  gitlab: SiGitlab,
  gmail: SiGmail,
  instagram: SiInstagram,
  linkedin: FaLinkedinIn,
  mail: SiGmail,
  medium: SiMedium,
  stackoverflow: SiStackoverflow,
  telegram: SiTelegram,
  threads: SiThreads,
  tiktok: SiTiktok,
  whatsapp: SiWhatsapp,
  x: FaXTwitter,
  twitter: FaXTwitter,
  youtube: SiYoutube,
};

function normalizeSocialIdentifier(value: string | null | undefined) {
  return value?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
}

function getSocialIcon(social: PublicSocialLink): IconType {
  if (social.iconKey && SOCIAL_ICONS_BY_KEY[social.iconKey]) {
    return SOCIAL_ICONS_BY_KEY[social.iconKey];
  }

  const candidates = [social.key, social.platform, social.label].map(
    normalizeSocialIdentifier,
  );

  for (const candidate of candidates) {
    if (SOCIAL_ICONS_BY_PLATFORM[candidate]) {
      return SOCIAL_ICONS_BY_PLATFORM[candidate];
    }
  }

  return FiLink;
}

function EmptyState() {
  return (
    <section
      className="grid min-h-[clamp(18rem,55svh,38rem)] max-w-[50rem] content-start pt-[clamp(1.25rem,4vw,3.25rem)]"
      aria-labelledby="empty-profile-title"
    >
      <p className="m-0 font-mono text-[clamp(0.5rem,0.65vw,0.7rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
        PROFILE / EMPTY
      </p>
      <MagneticTitle
        as="h1"
        id="empty-profile-title"
        text="Aún no hay información pública."
        className="mt-5 mb-0 text-[clamp(1.7rem,2.8vw,3.2rem)] leading-[0.98] font-normal tracking-[-0.055em]"
      />
      <p className="mt-7 mb-0 max-w-[39rem] text-[clamp(1rem,1.35vw,1.25rem)] leading-[1.7] text-[var(--muted)]">
        El perfil existe, pero todavía no contiene datos visibles para mostrar
        en esta sección.
      </p>
      <RouteTransitionLink
        href={HOME_PATH}
        className="mt-8 inline-flex w-fit max-w-full items-center gap-4 border border-[var(--line)] bg-transparent px-[1.125rem] py-4 text-[0.875rem] text-foreground no-underline transition duration-200 hover:-translate-y-0.5 hover:border-foreground focus-visible:-translate-y-0.5"
      >
        <FiArrowLeft aria-hidden="true" />
        Regresar al inicio
      </RouteTransitionLink>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <section
      className="grid min-h-[clamp(18rem,55svh,38rem)] max-w-[50rem] content-start pt-[clamp(1.25rem,4vw,3.25rem)]"
      aria-labelledby="profile-error-title"
    >
      <p className="m-0 font-mono text-[clamp(0.5rem,0.65vw,0.7rem)] tracking-[0.1em] text-[var(--muted)] uppercase">
        PROFILE / UNAVAILABLE
      </p>
      <MagneticTitle
        as="h1"
        id="profile-error-title"
        text="No pudimos cargar esta sección."
        className="mt-5 mb-0 text-[clamp(1.7rem,2.8vw,3.2rem)] leading-[0.98] font-normal tracking-[-0.055em]"
      />
      <p className="mt-7 mb-0 max-w-[39rem] text-[clamp(1rem,1.35vw,1.25rem)] leading-[1.7] text-[var(--muted)]">
        {message}
      </p>
      <button
        type="button"
        className="mt-8 inline-flex w-fit max-w-full cursor-pointer items-center gap-4 border border-foreground bg-foreground px-[1.125rem] py-4 text-[0.875rem] text-background transition duration-200 hover:-translate-y-0.5 hover:bg-transparent hover:text-foreground focus-visible:-translate-y-0.5"
        onClick={() => window.location.reload()}
        data-cursor="action"
      >
        <FiRefreshCw aria-hidden="true" />
        Intentar nuevamente
      </button>
    </section>
  );
}

type SocialItemProps = {
  href: string;
  label: string;
  detail: string | null;
  Icon: IconType;
  index: number;
  reducedMotion: boolean;
  external?: boolean;
};

function SocialItem({
  href,
  label,
  detail,
  Icon,
  index,
  reducedMotion,
  external = true,
}: SocialItemProps) {
  return (
    <motion.a
      className="group/social inline-flex min-w-0 items-center gap-[clamp(0.65rem,1vw,0.9rem)] bg-transparent py-1 text-foreground no-underline transition duration-300 ease-out hover:-translate-y-[0.2rem] hover:text-[var(--accent)] focus-visible:-translate-y-[0.2rem] focus-visible:text-[var(--accent)]"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={
        external
          ? `Abrir ${label} en una nueva pestaña`
          : `Enviar correo a ${detail ?? label}`
      }
      data-cursor="action"
      initial={reducedMotion ? false : { opacity: 0, y: "0.75rem" }}
      animate={{ opacity: 1, y: "0rem" }}
      transition={{
        duration: 0.46,
        delay: 0.34 + index * 0.06,
        ease: easing,
      }}
    >
      <span className="grid size-[clamp(2rem,2.5vw,2.3rem)] shrink-0 place-items-center rounded-full bg-[var(--surface)] text-foreground transition duration-300 ease-out group-hover/social:-rotate-6 group-hover/social:scale-105 group-hover/social:bg-foreground group-hover/social:text-background group-focus-visible/social:-rotate-6 group-focus-visible/social:scale-105 group-focus-visible/social:bg-foreground group-focus-visible/social:text-background">
        <Icon className="size-[clamp(0.85rem,1vw,1rem)]" aria-hidden="true" />
      </span>

      <span className="grid min-w-0 gap-[0.125rem]">
        <strong className="[overflow-wrap:anywhere] text-[clamp(0.82rem,0.9vw,0.96rem)] font-medium">
          {label}
        </strong>
        {detail && (
          <small className="[overflow-wrap:anywhere] text-[clamp(0.64rem,0.72vw,0.74rem)] text-[var(--muted)] transition-colors duration-200 group-hover/social:text-foreground group-focus-visible/social:text-foreground">
            {detail}
          </small>
        )}
      </span>

      <FiArrowUpRight
        className="ml-auto size-[clamp(0.8rem,1vw,0.95rem)] shrink-0 translate-x-[-0.375rem] translate-y-[0.375rem] opacity-0 transition duration-300 ease-out group-hover/social:translate-x-[0.125rem] group-hover/social:translate-y-[-0.125rem] group-hover/social:opacity-100 group-focus-visible/social:translate-x-[0.125rem] group-focus-visible/social:translate-y-[-0.125rem] group-focus-visible/social:opacity-100"
        aria-hidden="true"
      />
    </motion.a>
  );
}

function ProfileContent({
  profile,
  reducedMotion,
}: {
  profile: PublicProfile;
  reducedMotion: boolean;
}) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const hasSocialConnections = Boolean(
    profile.publicEmail || profile.socialLinks.length > 0,
  );
  const hasConnectionArea = hasSocialConnections || Boolean(profile.resumeUrl);
  const shortBio = profile.shortBio?.trim() ?? "";
  const longBio = profile.longBio?.trim() ?? "";
  const hasLongBio = longBio.length > 0 && longBio !== shortBio;

  const reveal = {
    hidden: { opacity: 0, y: "1.5rem" },
    visible: { opacity: 1, y: "0rem" },
  };

  return (
    <motion.div
      className="mx-auto grid w-full max-w-[96rem] gap-[clamp(2.75rem,5vw,5.75rem)]"
      initial={reducedMotion ? false : "hidden"}
      animate="visible"
      transition={{ staggerChildren: 0.1, delayChildren: 0.12 }}
    >
      <section
        className={`${styles.profileScene} grid min-w-0 gap-[clamp(2rem,4vw,3.75rem)]`}
        aria-label="Perfil profesional"
      >
        <motion.div
          className={`${styles.sceneSecondary} grid min-w-0`}
          variants={reveal}
          transition={{ duration: 0.68, ease: easing }}
        >
          <InteractiveSectionTitle
            id="profile-name"
            text="Sobre mí"
            size="profile"
            preserveCase
          />

          {profile.headline && (
            <p className="mt-[clamp(1rem,2vw,1.8rem)] mb-0 max-w-[52ch] font-mono text-[clamp(0.72rem,0.95vw,1rem)] leading-[1.5] tracking-[0.105em] text-[var(--accent)] uppercase">
              {profile.headline}
            </p>
          )}
        </motion.div>

        <div className="grid min-w-0 items-stretch gap-[clamp(1.5rem,3.2vw,3.25rem)] xl:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.65fr)]">
          {(shortBio || longBio) && (
            <motion.article
              className={`${styles.bioCard} soft-panel soft-panel-interactive relative grid min-h-[clamp(16rem,28vw,26rem)] min-w-0 content-between gap-[clamp(1.75rem,4vw,3.75rem)] p-[clamp(1.5rem,3.2vw,3rem)] outline-none motion-reduce:transform-none motion-reduce:transition-none`}
              variants={reveal}
              transition={{ duration: 0.72, ease: easing }}
              tabIndex={0}
              aria-label="Descripción profesional"
            >
              <span className="font-mono text-[clamp(0.62rem,0.7vw,0.74rem)] tracking-[0.11em] text-[var(--muted)] uppercase">
                PERFIL / 01
              </span>
              <div className="grid min-w-0 gap-[clamp(1rem,1.8vw,1.5rem)]">
                <p className="m-0 max-w-[48ch] [overflow-wrap:anywhere] text-[clamp(0.98rem,1.15vw,1.22rem)] leading-[1.62] tracking-[-0.012em] text-foreground">
                  {shortBio || longBio}
                </p>

                {hasLongBio && (
                  <>
                    <button
                      type="button"
                      className={styles.readMore}
                      aria-expanded={isBioExpanded}
                      aria-controls="about-long-bio"
                      onClick={() => setIsBioExpanded((current) => !current)}
                      data-cursor="action"
                    >
                      {isBioExpanded ? "Leer menos" : "Leer más"}
                      <span className={styles.readMoreIcon} aria-hidden="true">
                        <FiChevronDown />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isBioExpanded && (
                        <motion.div
                          id="about-long-bio"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.48, ease: easing }}
                          className="overflow-hidden"
                        >
                          <p className="m-0 max-w-[58ch] whitespace-pre-line [overflow-wrap:anywhere] border-t border-[var(--line)] pt-[clamp(1rem,1.8vw,1.5rem)] text-[clamp(0.9rem,1vw,1.05rem)] leading-[1.72] text-[var(--muted)]">
                            {longBio}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </motion.article>
          )}

          <motion.div
            className={`${styles.sceneSecondary} m-0 w-full min-w-0 max-w-[21rem] justify-self-end sm:max-w-[22rem]`}
            variants={reveal}
            transition={{ duration: 0.72, delay: 0.04, ease: easing }}
          >
            <ProfileBadge
              name={profile.publicName}
              headline={profile.headline}
              imageUrl={profile.profileImageUrl}
            />
          </motion.div>
        </div>
      </section>

      {hasConnectionArea && (
        <motion.section
          className="grid min-w-0 gap-[clamp(1.75rem,3vw,2.75rem)] border-t border-[var(--line)] pt-[clamp(1.75rem,3vw,2.75rem)]"
          variants={reveal}
          transition={{ duration: 0.72, ease: easing }}
          aria-label="Redes sociales y currículum"
        >
          <div
            className={`grid min-w-0 gap-[clamp(2.5rem,5vw,5rem)] ${
              hasSocialConnections && profile.resumeUrl
                ? "xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)]"
                : "grid-cols-1"
            }`}
          >
            {hasSocialConnections && (
              <div className="grid min-w-0 content-start gap-[clamp(1.5rem,2.5vw,2.25rem)]">
                <span className="font-mono text-[clamp(0.62rem,0.7vw,0.74rem)] tracking-[0.11em] text-[var(--muted)] uppercase">
                  CONECTEMOS / 02
                </span>

                <div className="grid min-w-0 grid-cols-1 gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-[clamp(1.25rem,2vw,2rem)] sm:grid-cols-2 xl:grid-cols-3">
                  {profile.socialLinks.map((social, index) => {
                    const SocialIcon = getSocialIcon(social);

                    return (
                      <SocialItem
                        key={`${social.key}-${social.url}`}
                        href={social.url}
                        label={social.label}
                        detail={
                          social.username
                            ? `@${social.username.replace(/^@/, "")}`
                            : null
                        }
                        Icon={SocialIcon}
                        index={index}
                        reducedMotion={reducedMotion}
                      />
                    );
                  })}

                  {profile.publicEmail && (
                    <SocialItem
                      href={`mailto:${profile.publicEmail}`}
                      label="Gmail"
                      detail={profile.publicEmail}
                      Icon={SiGmail}
                      index={profile.socialLinks.length}
                      reducedMotion={reducedMotion}
                      external={false}
                    />
                  )}
                </div>
              </div>
            )}

            {profile.resumeUrl && (
              <motion.aside
                className="soft-panel soft-panel-interactive group/resume grid min-w-0 content-between gap-[clamp(2rem,4vw,3.5rem)] p-[clamp(1.4rem,2.5vw,2.5rem)] motion-reduce:transform-none motion-reduce:transition-none"
                variants={reveal}
                transition={{ duration: 0.62, ease: easing }}
                aria-label="Currículum"
              >
                <div className="grid gap-[clamp(0.75rem,1.4vw,1.2rem)]">
                  <span className="font-mono text-[clamp(0.62rem,0.7vw,0.74rem)] tracking-[0.11em] text-[var(--muted)] uppercase">
                    CURRÍCULUM / 03
                  </span>
                  <p className="m-0 max-w-[32ch] text-[clamp(0.92rem,1vw,1.05rem)] leading-[1.6] text-[var(--muted)]">
                    Consulta mi trayectoria, experiencia y preparación en un
                    documento independiente.
                  </p>
                </div>

                <a
                  className="ui-button-primary group/resume-button inline-flex w-fit max-w-full items-center gap-3 px-[clamp(1rem,1.5vw,1.25rem)] py-[clamp(0.8rem,1vw,1rem)] text-[clamp(0.78rem,0.85vw,0.9rem)] no-underline transition duration-300 ease-out hover:-translate-y-[0.2rem] hover:text-[var(--accent)] focus-visible:-translate-y-[0.2rem] focus-visible:text-[var(--accent)] motion-reduce:transform-none motion-reduce:transition-none"
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir currículum en una nueva pestaña"
                  data-cursor="action"
                >
                  <span className="grid size-[clamp(2rem,2.5vw,2.3rem)] shrink-0 place-items-center rounded-full bg-[var(--surface)] text-foreground transition duration-300 ease-out group-hover/resume-button:-rotate-6 group-hover/resume-button:scale-105 group-hover/resume-button:bg-foreground group-hover/resume-button:text-background group-focus-visible/resume-button:-rotate-6 group-focus-visible/resume-button:scale-105 group-focus-visible/resume-button:bg-foreground group-focus-visible/resume-button:text-background motion-reduce:transform-none motion-reduce:transition-none">
                    <FaLink
                      className="size-[clamp(0.85rem,1vw,1rem)]"
                      aria-hidden="true"
                    />
                  </span>
                  <strong className="font-medium">Ver currículum</strong>
                  <FiArrowUpRight
                    className="size-[clamp(0.8rem,1vw,0.95rem)] shrink-0 translate-x-[-0.375rem] translate-y-[0.375rem] opacity-0 transition duration-300 ease-out group-hover/resume-button:translate-x-[0.125rem] group-hover/resume-button:translate-y-[-0.125rem] group-hover/resume-button:opacity-100 group-focus-visible/resume-button:translate-x-[0.125rem] group-focus-visible/resume-button:translate-y-[-0.125rem] group-focus-visible/resume-button:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </a>
              </motion.aside>
            )}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}

export function AboutMeView({ result }: { result: ProfileLoadResult }) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <main
      className="site-page grid min-h-svh bg-background p-[clamp(1.25rem,3vw,3rem)] text-foreground"
      aria-label="Sobre mí"
    >
      <div className="w-full py-[clamp(4rem,8vh,7rem)]">
        {result.status === "success" && (
          <ProfileContent
            profile={result.profile}
            reducedMotion={shouldReduceMotion}
          />
        )}
        {result.status === "empty" && <EmptyState />}
        {result.status === "error" && <ErrorState message={result.message} />}
      </div>
    </main>
  );
}
