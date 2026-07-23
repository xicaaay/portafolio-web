"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { IconType } from "react-icons";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiChevronDown,
  FiDownload,
  FiLink,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiX,
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
import badgeStyles from "./profile-badge.module.css";
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

function buildPdfViewerUrl(pdfUrl: string) {
  const urlWithoutFragment = pdfUrl.split("#", 1)[0];
  return `${urlWithoutFragment}#page=1&view=Fit&toolbar=0&navpanes=0`;
}

function ResumeCard({
  reducedMotion,
  onOpen,
}: {
  reducedMotion: boolean;
  onOpen: () => void;
}) {
  const [isActive, setIsActive] = useState(false);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, {
    stiffness: 118,
    damping: 11,
    mass: 0.42,
  });
  const springY = useSpring(offsetY, {
    stiffness: 118,
    damping: 11,
    mass: 0.42,
  });

  const release = () => {
    setIsActive(false);
    offsetX.set(0);
    offsetY.set(0);
  };

  const followPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const distanceX = event.clientX - (bounds.left + bounds.width / 2);
    const distanceY = event.clientY - (bounds.top + bounds.height / 2);
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;

    setIsActive(true);
    event.currentTarget.style.setProperty("--magnetic-x", `${pointerX}%`);
    event.currentTarget.style.setProperty("--magnetic-y", `${pointerY}%`);
    offsetX.set(Math.max(-30, Math.min(30, distanceX * 0.32)));
    offsetY.set(Math.max(-22, Math.min(22, distanceY * 0.42)));
  };

  return (
    <motion.button
      type="button"
      className={`${styles.resumePreview} ${badgeStyles.badge}`}
      style={reducedMotion ? undefined : { x: springX, y: springY }}
      animate={{ scale: !reducedMotion && isActive ? 1.045 : 1 }}
      transition={{ duration: 0.38, ease: easing }}
      onPointerMove={followPointer}
      onPointerLeave={release}
      onFocus={() => setIsActive(true)}
      onBlur={release}
      onClick={onOpen}
      aria-label="Abrir currículum"
      data-cursor="action"
      data-resume-card="true"
      data-magnetic-active={isActive ? "true" : undefined}
    >
      <span className={badgeStyles.cardInner}>
        <span
          className={`${badgeStyles.face} ${badgeStyles.front} ${styles.resumeFace}`}
        >
          <span className={badgeStyles.grip} aria-hidden="true" />

          <span
            className={`${badgeStyles.photo} ${styles.resumeWritingSurface}`}
            aria-hidden="true"
          >
            <span className={styles.resumeWritingLines}>
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
          </span>

          <span className={badgeStyles.identity}>
            <strong>Currículum vitae</strong>
            <span>Trayectoria profesional</span>
          </span>
        </span>
      </span>
    </motion.button>
  );
}

function ResumeModal({
  pdfUrl,
  name,
  reducedMotion,
  onClose,
}: {
  pdfUrl: string;
  name: string | null;
  reducedMotion: boolean;
  onClose: () => void;
}) {
  const stageRef = useRef<HTMLElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [viewerSize, setViewerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const pageRatio = 0.68;
    const updateViewerSize = () => {
      const availableWidth = stage.clientWidth;
      const availableHeight = stage.clientHeight;
      const fittedHeight = Math.min(
        availableHeight,
        availableWidth / pageRatio,
      );

      setViewerSize({
        width: Math.floor(fittedHeight * pageRatio),
        height: Math.floor(fittedHeight),
      });
    };

    updateViewerSize();
    const resizeObserver = new ResizeObserver(updateViewerSize);
    resizeObserver.observe(stage);

    return () => resizeObserver.disconnect();
  }, []);

  const decreaseZoom = () => {
    setZoom((current) => Math.max(0.75, current - 0.25));
  };

  const increaseZoom = () => {
    setZoom((current) => Math.min(1.75, current + 0.25));
  };

  const downloadResume = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    const resumeFileName = `CV-${(name ?? "Amilcar Xicay")
      .trim()
      .replace(/\s+/g, "-")}.pdf`;

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("No se pudo descargar el currículum.");

      const fileBlob = await response.blob();
      const objectUrl = URL.createObjectURL(fileBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = objectUrl;
      downloadLink.download = resumeFileName;
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    } catch {
      const fallbackLink = document.createElement("a");
      fallbackLink.href = pdfUrl;
      fallbackLink.target = "_blank";
      fallbackLink.rel = "noopener noreferrer";
      fallbackLink.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const viewerStyle = viewerSize
    ? {
        width: `${viewerSize.width * zoom}px`,
        height: `${viewerSize.height * zoom}px`,
        maxWidth: "none",
      }
    : undefined;

  return (
    <motion.div
      className={styles.resumeModalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-dialog-title"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.08 : 0.26 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.article
        className={styles.resumeModal}
        initial={
          reducedMotion
            ? false
            : { opacity: 0, y: "1.5rem", scale: 0.97 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: "1rem", scale: 0.98 }}
        transition={{ duration: 0.4, ease: easing }}
        data-cursor-color="var(--cursor-primary)"
      >
        <span className={`${styles.resumeModalCorner} ${styles.resumeModalCornerTl}`} />
        <span className={`${styles.resumeModalCorner} ${styles.resumeModalCornerTr}`} />
        <span className={`${styles.resumeModalCorner} ${styles.resumeModalCornerBl}`} />
        <span className={`${styles.resumeModalCorner} ${styles.resumeModalCornerBr}`} />

        <header className={styles.resumeModalHeader}>
          <div className={styles.resumeModalHeading}>
            <span className="section-route-marker font-mono text-[clamp(0.58rem,0.68vw,0.74rem)] tracking-[0.1em] uppercase">
              03 / CURRÍCULUM
            </span>
            <MagneticTitle
              as="h2"
              id="resume-dialog-title"
              text="Mi currículum"
              className={styles.resumeModalTitle}
            />

            <div
              className={styles.resumeModalActions}
              aria-label="Acciones del currículum"
            >
              <button
                type="button"
                className={styles.resumeModalExternal}
                onClick={downloadResume}
                disabled={isDownloading}
                aria-label="Descargar currículum en PDF"
                data-cursor="action"
                data-downloading={isDownloading ? "true" : undefined}
              >
                <span className={styles.resumeModalExternalIcon}>
                  <FiDownload aria-hidden="true" />
                </span>
                <span>{isDownloading ? "Descargando…" : "Descargar"}</span>
              </button>

              <a
                className={styles.resumeModalExternal}
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver currículum en una pestaña nueva"
                data-cursor="action"
              >
                <span className={styles.resumeModalExternalIcon}>
                  <FiArrowUpRight aria-hidden="true" />
                </span>
                <span>Ver en pestaña nueva</span>
              </a>
            </div>

            <small>Presiona ESC o × para cerrar</small>
          </div>

          <div className={styles.resumeModalControls}>
            <div
              className={styles.resumeZoomControls}
              role="group"
              aria-label="Controles de zoom"
            >
              <button
                type="button"
                onClick={decreaseZoom}
                disabled={zoom <= 0.75}
                aria-label="Alejar currículum"
                data-cursor="action"
              >
                <FiMinus aria-hidden="true" />
              </button>
              <output aria-live="polite">{Math.round(zoom * 100)}%</output>
              <button
                type="button"
                onClick={increaseZoom}
                disabled={zoom >= 1.75}
                aria-label="Acercar currículum"
                data-cursor="action"
              >
                <FiPlus aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              className={styles.resumeModalClose}
              onClick={onClose}
              aria-label="Cerrar currículum"
              data-cursor="action"
              autoFocus
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
        </header>

        <figure ref={stageRef} className={styles.resumeModalStage}>
          <div className={styles.resumeModalDocument}>
            <iframe
              src={buildPdfViewerUrl(pdfUrl)}
              title={`Currículum de ${name ?? "Amilcar"}`}
              style={viewerStyle}
            />
          </div>
        </figure>
      </motion.article>
    </motion.div>
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
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const hasSocialConnections = Boolean(
    profile.publicEmail || profile.socialLinks.length > 0,
  );
  const hasResume = Boolean(profile.resumeUrl);
  const shortBio = profile.shortBio?.trim() ?? "";
  const longBio = profile.longBio?.trim() ?? "";
  const hasLongBio = longBio.length > 0 && longBio !== shortBio;

  const reveal = {
    hidden: { opacity: 0, y: "1.5rem" },
    visible: { opacity: 1, y: "0rem" },
  };

  return (
    <motion.div
      className="mx-auto grid w-full max-w-[96rem] gap-[clamp(2.25rem,4vw,4.25rem)]"
      initial={reducedMotion ? false : "hidden"}
      animate="visible"
      transition={{ staggerChildren: 0.1, delayChildren: 0.12 }}
    >
      <section
        className={`${styles.profileScene} grid min-w-0 items-center gap-[clamp(2rem,5vw,5.5rem)] ${
          hasResume
            ? "xl:grid-cols-[minmax(0,1fr)_minmax(38rem,0.95fr)]"
            : "xl:grid-cols-[minmax(0,1.25fr)_minmax(16rem,0.55fr)]"
        }`}
        aria-label="Perfil profesional"
      >
        <div className="grid min-w-0 content-center gap-[clamp(2rem,4vw,3.75rem)]">
          <motion.div
            className={`${styles.sceneSecondary} grid min-w-0 gap-[clamp(0.85rem,1.6vw,1.4rem)]`}
            variants={reveal}
            transition={{ duration: 0.68, ease: easing }}
          >
            <span className="section-route-marker font-mono text-[clamp(0.62rem,0.72vw,0.78rem)] tracking-[0.1em] uppercase">
              01 / PERFIL
            </span>

            <InteractiveSectionTitle
              id="profile-name"
              text="Sobre mí"
              size="profile"
              preserveCase
            />

            {profile.headline && (
              <p className="m-0 max-w-[52ch] font-mono text-[clamp(0.72rem,0.95vw,1rem)] leading-[1.5] tracking-[0.105em] text-[var(--accent)] uppercase">
                {profile.headline}
              </p>
            )}
          </motion.div>

          {(shortBio || longBio) && (
            <motion.article
              className={`${styles.bioCard} soft-panel soft-panel-interactive relative grid min-w-0 gap-[clamp(1.25rem,2vw,2rem)] border-t border-[var(--line)] pt-[clamp(1.25rem,2vw,2rem)] outline-none motion-reduce:transform-none motion-reduce:transition-none`}
              variants={reveal}
              transition={{ duration: 0.72, ease: easing }}
              tabIndex={0}
              aria-label="Descripción profesional"
            >
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
        </div>

        <motion.div
          className={`${styles.sceneSecondary} ${styles.profileCards}`}
          data-single={!hasResume ? "true" : undefined}
          variants={reveal}
          transition={{ duration: 0.72, delay: 0.04, ease: easing }}
        >
          <ProfileBadge
            name={profile.publicName}
            headline={profile.headline}
            imageUrl={profile.profileImageUrl}
          />

          {profile.resumeUrl && (
            <div className={styles.resumeCardStage}>
              <ResumeCard
                reducedMotion={reducedMotion}
                onOpen={() => setIsResumeOpen(true)}
              />
            </div>
          )}
        </motion.div>
      </section>

      {hasSocialConnections && (
        <motion.section
          className="grid min-w-0 gap-[clamp(1.75rem,3vw,2.75rem)] border-t border-[var(--line)] pt-[clamp(1.75rem,3vw,2.75rem)]"
          variants={reveal}
          transition={{ duration: 0.72, ease: easing }}
          aria-label="Redes sociales"
        >
          <div className="grid min-w-0 content-start gap-[clamp(1.5rem,2.5vw,2.25rem)]">
            <span className="section-route-marker font-mono text-[clamp(0.62rem,0.7vw,0.74rem)] tracking-[0.11em] uppercase">
              02 / CONECTEMOS
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
        </motion.section>
      )}

      <AnimatePresence>
        {isResumeOpen && profile.resumeUrl && (
          <ResumeModal
            pdfUrl={profile.resumeUrl}
            name={profile.publicName}
            reducedMotion={reducedMotion}
            onClose={() => setIsResumeOpen(false)}
          />
        )}
      </AnimatePresence>
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
