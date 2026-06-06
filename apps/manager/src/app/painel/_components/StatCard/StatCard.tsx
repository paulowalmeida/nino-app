import type { StatCardProps } from './stat-card-props'
import styles from './StatCard.module.css'

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        <div className={styles.iconWrap}>{icon}</div>
      </div>
      <span className={styles.value}>{value}</span>
    </div>
  )
}
