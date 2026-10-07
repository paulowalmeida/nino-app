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
      <div className={`${styles.floatingNotificationIcon} ${styles[iconVariant]}`}>{icon}</div>

      <div>
        <span className={styles.floatingNotificationTitle}>{title}</span>

        <span className={styles.floatingNotificationSubtitle}>{subtitle}</span>
      </div>
    </div>
  )
}
