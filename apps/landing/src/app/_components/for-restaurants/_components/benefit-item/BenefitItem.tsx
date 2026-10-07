import styles from "./BenefitItem.module.css"
import type { BenefitItemProps } from "./BenefitItem.types"

export function BenefitItem({ text }: BenefitItemProps) {
  return (
    <div className={styles.benefitItem}>
      <span className={styles.check}>✓</span>
      <span>{text}</span>
    </div>
  )
}
