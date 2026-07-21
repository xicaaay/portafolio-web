import styles from "./interactive-section-title.module.css";

type InteractiveSectionTitleProps = {
  text: string;
  id?: string;
};

export function InteractiveSectionTitle({
  text,
  id,
}: InteractiveSectionTitleProps) {
  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <h1 id={id} className={`${styles.title} font-display`} aria-label={text}>
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
