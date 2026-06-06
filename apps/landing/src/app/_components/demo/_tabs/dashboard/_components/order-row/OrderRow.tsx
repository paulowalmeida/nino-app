import styles from "./OrderRow.module.css"
import type { OrderRowProps } from "./OrderRow.types"

export function OrderRow({
  icon,
  customer,
  item,
  time,
  price,
  delivered,
}: OrderRowProps) {
  const classDelivery = delivered
    ? styles.statusDelivered
    : styles.statusOnTheWay
  return (
    <div className={styles.orderRow}>
      <div className={styles.orderDetails}>
        <div className={styles.productEmoji}>{icon}</div>

        <div>
          <div className={styles.customerName}>{customer}</div>

          <div className={styles.itemMeta}>
            {item} · {time}
          </div>
        </div>
      </div>

      <div>
        <div className={styles.orderPrice}>{price}</div>

        <div className={classDelivery}>
          {delivered ? "Entregue" : "A caminho"}
        </div>
      </div>
    </div>
  )
}
