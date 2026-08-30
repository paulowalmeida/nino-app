import { Button } from '@nino/ds/components/Button'
import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'
import {
  PAYMENT_METHOD_LABEL_BY_CHANNEL,
  PAYMENT_STATUS_LABEL,
} from '@shared/constants/order.constants'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import { OrderChangeLine } from './OrderChangeLine/OrderChangeLine'

import motion from '@styles/motion.module.css'
import styles from './OrderPaymentBlock.module.css'

export const OrderPaymentBlock = () => {
  const { order, canMarkPaid, markOrderPaid, isPaying } = useOrderDetailFacade()

  if (!order) return null

  return (
    <section
      aria-label="Pagamento"
      className={`${motion.settle} ${styles.block}`}
      style={riseDelay(140)}
    >
      <h2 className={styles.cardTitle}>Pagamento</h2>

      <p className={styles.payLine}>
        {PAYMENT_METHOD_LABEL_BY_CHANNEL[order.channel][order.paymentMethod]}
        <span className={styles.payState}>
          {' '}
          · {PAYMENT_STATUS_LABEL[order.paymentStatus]}
        </span>
      </p>

      <OrderChangeLine order={order} />

      {canMarkPaid && (
        <Button
          variant="outline"
          size="sm"
          loading={isPaying}
          className={`${motion.press} ${styles.payButton}`}
          onClick={() => markOrderPaid(order.id)}
        >
          Recebi o pagamento
        </Button>
      )}
    </section>
  )
}
