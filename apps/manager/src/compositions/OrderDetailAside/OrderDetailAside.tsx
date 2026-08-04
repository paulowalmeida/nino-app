import { Button } from '@nino/ds/components/Button'
import { Textarea } from '@nino/ds/components/Textarea'
import { OrderTimeline } from '@compositions/OrderTimeline/OrderTimeline'
import type { Order, OrderStatusKey } from '@custom_types/order'
import { brl } from '@utils/money'
import { formatPhone } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'
import {
  addressOf,
  canCancel,
  customerNameOf,
  nextStep,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
} from '@utils/order-flow'

import styles from '@pages/order-detail/OrderDetail.module.css'
import motion from '@styles/motion.module.css'

export type OrderDetailAsideProps = {
  order: Order
  isAdvancing: boolean
  isPaying: boolean
  isCancelling: boolean
  reason: string
  onReasonChange: (reason: string) => void
  onMarkPaid: () => void
  onAdvance: (target: OrderStatusKey) => void
  onStartCancel: () => void
  onConfirmCancel: () => void
  onAbortCancel: () => void
}

export const OrderDetailAside = ({
  order,
  isAdvancing,
  isPaying,
  isCancelling,
  reason,
  onReasonChange,
  onMarkPaid,
  onAdvance,
  onStartCancel,
  onConfirmCancel,
  onAbortCancel,
}: OrderDetailAsideProps) => {
  const step = nextStep(order)
  const address = addressOf(order)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <div className={styles.aside}>
      <section
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

      <section
        className={`${motion.settle} ${styles.block}`}
        style={riseDelay(140)}
      >
        <h2 className={styles.cardTitle}>Pagamento</h2>
        <p className={styles.payLine}>
          {PAYMENT_METHOD_LABEL[order.paymentMethod]}
          <span className={styles.payState}>
            {' '}
            · {PAYMENT_STATUS_LABEL[order.paymentStatus]}
          </span>
        </p>
        {order.changeFor && (
          <p className={styles.change}>
            Levar troco para {brl(order.changeFor)}
          </p>
        )}
        {order.paymentStatus === 'PENDING' && !isCancelled && (
          <Button
            variant="outline"
            size="sm"
            loading={isPaying}
            className={`${motion.press} ${styles.payButton}`}
            onClick={onMarkPaid}
          >
            Recebi o pagamento
          </Button>
        )}
      </section>

      <section
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

      {(step || canCancel(order.status)) && (
        <section
          className={`${motion.settle} ${styles.actions}`}
          style={riseDelay(260)}
        >
          {step && (
            <Button
              loading={isAdvancing}
              className={`${motion.press} ${styles.advance}`}
              onClick={() => onAdvance(step.target)}
            >
              {step.label}
            </Button>
          )}

          {canCancel(order.status) && !isCancelling && (
            <Button variant="ghost" size="sm" onClick={onStartCancel}>
              Cancelar pedido
            </Button>
          )}

          {isCancelling && (
            <div className={`${motion.unroll} ${styles.cancelBox}`}>
              <label className={styles.cancelLabel} htmlFor="cancel-reason">
                Por que o pedido está sendo cancelado?
              </label>
              <Textarea
                id="cancel-reason"
                rows={2}
                value={reason}
                maxLength={280}
                placeholder="O cliente vê este motivo"
                onChange={(event) => onReasonChange(event.target.value)}
              />
              <div className={styles.cancelActions}>
                <Button
                  size="sm"
                  loading={isAdvancing}
                  disabled={reason.trim().length === 0}
                  onClick={onConfirmCancel}
                >
                  Confirmar cancelamento
                </Button>
                <Button size="sm" variant="ghost" onClick={onAbortCancel}>
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
