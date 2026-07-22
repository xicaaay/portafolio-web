import type { CSSProperties } from "react";
import { MagneticTitle } from "./magnetic-title";
import styles from "./interactive-section-title.module.css";

type InteractiveSectionTitleProps = {
  text: string;
  id?: string;
  size?: "section" | "profile";
  preserveCase?: boolean;
  appearance?: "solid" | "outline" | "last-outline";
};

type TitleStyle = CSSProperties & {
  "--title-fluid-size": string;
};

export function InteractiveSectionTitle({
  text,
  id,
  size = "section",
  preserveCase = false,
  appearance = "solid",
}: InteractiveSectionTitleProps) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const longestWordLength = Math.max(
    1,
    ...words.map((word) => Array.from(word).length),
  );
  const maximumViewportSize = size === "profile" ? 6.4 : 8.5;
  const availableViewportWidth = size === "profile" ? 72 : 82;
  const fittedViewportSize = Math.min(
    maximumViewportSize,
    availableViewportWidth / (longestWordLength * 0.58),
  );
  const titleStyle: TitleStyle = {
    "--title-fluid-size": `${fittedViewportSize.toFixed(3)}vw`,
  };

  return (
    <MagneticTitle
      as="h1"
      text={text}
      id={id}
      className={`${styles.title} ${
        size === "profile" ? styles.profileTitle : styles.sectionTitle
      } ${preserveCase ? styles.preserveCase : ""} font-display`}
      style={titleStyle}
      fullWidth
      appearance={appearance}
    />
  );
}
