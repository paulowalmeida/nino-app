import styles from "./FeatureCard.module.css"
import type { FeatureCardProps } from "./FeatureCard.types"

export function FeatureCard({
  num,
  icon,
  title,
  text,
  featured = false,
  tag,
}: FeatureCardProps) {
  return (
    <article
      className={`${styles.card}${featured ? ` ${styles.featured}` : ""}`}
    >
      <span className={styles.sequenceNumber}>{num}</span>

      <span className={styles.iconWrapper}>{icon}</span>

      <h3 className={styles.cardTitle}>{title}</h3>

      <p className={styles.cardBody}>{text}</p>

      {tag && <span className={styles.highlightTag}>★ {tag}</span>}
    </article>
  )
}
