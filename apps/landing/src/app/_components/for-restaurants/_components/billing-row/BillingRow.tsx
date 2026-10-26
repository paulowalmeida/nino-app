import styles from "./BillingRow.module.css"
import type { BillingRowProps } from "./BillingRow.types"

export function BillingRow({ name, model, isNino = false }: BillingRowProps) {
  return (
    <div className={`${styles.billingRow}${isNino ? ` ${styles.ninoRow}` : ""}`}>
      <span className={isNino ? styles.ninoName : styles.platformName}>
        {name}
      </span>
      <span className={isNino ? styles.ninoRate : styles.rate}>{model}</span>
    </div>
  )
}
