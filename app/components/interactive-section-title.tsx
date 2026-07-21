import type { CSSProperties } from "react";
import styles from "./interactive-section-title.module.css";

type InteractiveSectionTitleProps = {
  text: string;
  id?: string;
  size?: "section" | "profile";
  preserveCase?: boolean;
};

type TitleStyle = CSSProperties & {
  "--title-fluid-size": string;
};

export function InteractiveSectionTitle({
  text,
  id,
  size = "section",
  preserveCase = false,
}: InteractiveSectionTitleProps) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const longestWordLength = Math.max(
    1,
    ...words.map((word) => Array.from(word).length),
  );
  const maximumViewportSize = size === "profile" ? 9 : 13;
  const availableViewportWidth = size === "profile" ? 88 : 92;
  const fittedViewportSize = Math.min(
    maximumViewportSize,
    availableViewportWidth / (longestWordLength * 0.58),
  );
  const titleStyle: TitleStyle = {
    "--title-fluid-size": `${fittedViewportSize.toFixed(3)}vw`,
  };

  return (
    <h1
      id={id}
      className={`${styles.title} ${
        size === "profile" ? styles.profileTitle : styles.sectionTitle
      } ${preserveCase ? styles.preserveCase : ""} font-display`}
      style={titleStyle}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span className={styles.word} key={`${word}-${wordIndex}`}>
          {Array.from(word).map((character, characterIndex) => (
            <span
              className={styles.character}
              key={`${character}-${characterIndex}`}
              aria-hidden="true"
            >
              <span className={styles.fill}>{character}</span>
              <span className={styles.outline}>{character}</span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
