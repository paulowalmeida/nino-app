import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'
import { OrderTimeline } from '@shared/components/OrderTimeline/OrderTimeline'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './OrderProgressBlock.module.css'

export const OrderProgressBlock = () => {
  const { order } = useOrderDetailFacade()

  if (!order) return null

  return (
    <section
      aria-label="Andamento"
      className={`${motion.settle} ${styles.block}`}
      style={riseDelay(200)}
    >
      <h2 className={styles.cardTitle}>Andamento</h2>

      <OrderTimeline entries={order.statusHistory} />

      {order.cancelReason && (
        <p className={styles.cancelReason}>
          Motivo do cancelamento: {order.cancelReason}
        </p>
      )}
    </section>
  )
}
