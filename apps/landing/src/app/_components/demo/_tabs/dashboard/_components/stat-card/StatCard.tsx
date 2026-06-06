import styles from "./StatCard.module.css"
import type { StatCardProps } from "./StatCard.types"

export function StatCard({
  label,
  value,
  trend,
  accent = false,
  up,
}: StatCardProps) {
  const statCardHighlighted = accent ? "highlighted" : ""
  const metricValueHighlighted = accent ? "highlighted" : ""

  return (
    <div className={`${styles.statCard}${statCardHighlighted}`}>
      <div className={styles.metricLabel}>{label}</div>

      <div className={`${styles.metricValue}${metricValueHighlighted}`}>
        {value}
      </div>

      <div className={up ? styles.trendPositive : styles.trendStable}>
        {trend}
      </div>
    </div>
  )
}
