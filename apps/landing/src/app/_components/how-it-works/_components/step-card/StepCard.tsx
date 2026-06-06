import styles from "./StepCard.module.css"
import type { StepCardProps } from "./StepCard.types"

export function StepCard({ title, text, index }: StepCardProps) {
  return (
    <div className={styles.step}>
      <div className={styles.number}>{index + 1}</div>

      <h3 className={styles.title}>{title}</h3>

      <p className={styles.body}>{text}</p>
    </div>
  )
}
