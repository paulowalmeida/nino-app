import styles from "./FloatingNotification.module.css"
import type { FloatingNotificationProps } from "./FloatingNotification.types"

export function FloatingNotification({
  icon,
  iconVariant,
  placement,
  title,
  subtitle,
}: FloatingNotificationProps) {
  return (
    <div className={`${styles.notification} ${styles[placement]}`}>
      <div className={`${styles.icon} ${styles[iconVariant]}`}>{icon}</div>

      <div>
        <span className={styles.title}>{title}</span>

        <span className={styles.subtitle}>{subtitle}</span>
      </div>
    </div>
  )
}
