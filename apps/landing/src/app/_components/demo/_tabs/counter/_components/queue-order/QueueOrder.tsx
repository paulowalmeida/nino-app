import styles from "./QueueOrder.module.css"
import type { QueueOrderProps } from "./QueueOrder.types"

export function QueueOrder({
  code,
  consumer,
  items,
  total,
  status,
  tone,
  trail,
}: QueueOrderProps) {
  return (
    <article className={styles.queueOrderRow}>
      <div className={styles.identity}>
        <span className={styles.code}>{code}</span>

        <span className={styles.consumer}>{consumer}</span>

        <span className={styles.items}>{items}</span>
      </div>

      <div className={styles.state}>
        <span className={`${styles.queueOrderStatus} ${styles[tone]}`}>{status}</span>

        <span className={styles.queueOrderTotal}>{total}</span>
      </div>

      <p className={styles.trail}>{trail}</p>
    </article>
  )
}
