import type { ExperienceItem } from "../../lib/experiences";
import { format, type Dictionary } from "../../lib/i18n/dictionaries";
import { BrushStrokes } from "./brush-strokes";
import { Reveal } from "./home-motion";
import styles from "./home-landing.module.css";

const TRAJECTORY_BRUSHES = [
  { brush: 3, className: styles.trajectoryBrush1 },
  { brush: 1, className: styles.trajectoryBrush2 },
] as const;

/* Sección «Trayectoria»: línea de tiempo con las experiencias publicadas en Payload. */
export function TrajectorySection({ dict, experiences }: { dict: Dictionary; experiences: ExperienceItem[] }) {
  if (!experiences.length) return null;

  return (
    <section aria-labelledby="trayectoria-titulo" className={styles.trajectory} id="trayectoria">
      <BrushStrokes className={styles.trajectoryBrushes} items={TRAJECTORY_BRUSHES} />

      <div className={styles.trajectoryInner}>
        <Reveal kind="rise" onView>
          <h2 className={styles.trajectoryTitle} id="trayectoria-titulo">
            {dict.career.title}
          </h2>
        </Reveal>

        <ol className={styles.timeline}>
          {experiences.map((item, index) => (
            <li key={item.id}>
              <Reveal className={styles.timelineItem} delay={index * 0.06} kind="rise" onView>
                <div className={styles.timelineWhen}>
                  <p className={styles.timelinePeriod}>{item.period}</p>
                  {item.employmentType && <p className={styles.timelineType}>{item.employmentType}</p>}
                </div>

                <div className={styles.timelineBody}>
                  <h3 className={styles.timelineRole}>{item.position}</h3>
                  <p className={styles.timelineCompany}>
                    {item.company}
                    {item.location && <> · {item.location}</>}
                  </p>

                  {item.summary && <p className={styles.timelineSummary}>{item.summary}</p>}

                  {item.achievements.length > 0 && (
                    <ul className={styles.timelineList}>
                      {item.achievements.map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  )}

                  {item.technologies.length > 0 && (
                    <ul aria-label={format(dict.common.technologiesAt, { company: item.company })} className={styles.timelinePills}>
                      {item.technologies.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
