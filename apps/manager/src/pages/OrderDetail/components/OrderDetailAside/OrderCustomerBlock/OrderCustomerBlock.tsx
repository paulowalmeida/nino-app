import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'
import { addressOf, customerNameOf } from '@shared/utils/order-customer/order-customer'
import { formatPhone } from '@shared/utils/phone/phone'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './OrderCustomerBlock.module.css'

export const OrderCustomerBlock = () => {
  const { order } = useOrderDetailFacade()

  if (!order) return null

  const address = addressOf(order)

  return (
    <section
      aria-label="Quem pediu"
      className={`${motion.settle} ${styles.block}`}
      style={riseDelay(80)}
    >
      <h2 className={styles.cardTitle}>Quem pediu</h2>
      <p className={styles.customer}>{customerNameOf(order)}</p>

      {order.guestPhone && (
        <a href={`tel:${order.guestPhone}`} className={styles.phone}>
          {formatPhone(order.guestPhone)}
        </a>
      )}

      {address && <p className={styles.address}>{address}</p>}

      {order.tableNumber && (
        <p className={styles.address}>Mesa {order.tableNumber}</p>
      )}
    </section>
  )
}
