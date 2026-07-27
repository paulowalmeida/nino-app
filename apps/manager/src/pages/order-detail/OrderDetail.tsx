import { useState } from 'react'
import { useParams } from 'react-router'

import { BackLink } from '@components/BackLink'

import { Alert } from '@nino/ds/components/Alert'
import { Badge } from '@nino/ds/components/Badge'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Textarea } from '@nino/ds/components/Textarea'
import { OrderTimeline } from '@compositions/OrderTimeline'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useOrder } from '@hooks/order/useOrder'
import { useOrderPayment } from '@hooks/order/useOrderPayment'
import { useOrderStatus } from '@hooks/order/useOrderStatus'
import { brl } from '@utils/money'
import { formatPhone } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'
import {
  addressOf,
  canCancel,
  CHANNEL_LABEL,
  customerNameOf,
  nextStep,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
  STATUS_LABEL,
  ticketNumber,
} from '@utils/order-flow'

import styles from './OrderDetail.module.css'
import motion from '@styles/motion.module.css'

const stamp = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export const OrderDetail = () => {
  const { orderId } = useParams()
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { data: order, isPending } = useOrder(tenantId, orderId as string)
  const { mutate: advance, isPending: isAdvancing } = useOrderStatus(tenantId)
  const { mutate: markPaid, isPending: isPaying } = useOrderPayment(tenantId)

  const [reason, setReason] = useState('')
  const [isCancelling, setCancelling] = useState(false)

  if (isPending) {
    return (
      <div className={styles.page}>
        <Skeleton className={styles.skeleton} />
      </div>
    )
  }

  if (!order) {
    return (
      <div className={styles.page}>
        <Alert variant="info">
          Este pedido não está mais nesta loja. Ele pode ter sido removido.
        </Alert>
        <BackLink>Pedidos</BackLink>
      </div>
    )
  }

  const step = nextStep(order)
  const address = addressOf(order)
  const isCancelled = order.status === 'CANCELLED'

  const handleCancel = () => {
    advance({ orderId: order.id, status: 'CANCELLED', cancelReason: reason })
    setCancelling(false)
    setReason('')
  }

  return (
    <div className={styles.page}>
      <BackLink>Pedidos</BackLink>

      <Card className={`${motion.settle} ${styles.hero}`}>
        <div className={styles.heroText}>
          <p className={styles.channel}>{CHANNEL_LABEL[order.channel]}</p>
          <h1 className={`${motion.land} ${styles.number}`}>
            #{ticketNumber(order.id)}
          </h1>
          <p className={styles.opened}>
            aberto em {stamp.format(new Date(order.createdAt))}
          </p>
        </div>
        <Badge
          variant={isCancelled ? 'error' : 'default'}
          className={styles.badge}
        >
          {STATUS_LABEL[order.status]}
        </Badge>
      </Card>

      <div className={styles.columns}>
        <section
          className={`${motion.unroll} ${styles.receipt}`}
          aria-label="Itens do pedido"
        >
          <ul className={styles.items}>
            {order.items.map((item, index) => (
              <li
                key={item.id}
                className={`${motion.deal} ${styles.item}`}
                style={riseDelay(index * 45 + 60)}
              >
                <span className={styles.quantity}>{item.quantity}×</span>
                <span className={styles.itemName}>{item.product.name}</span>
                <span className={styles.itemPrice}>
                  {brl(Number(item.unitPrice) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className={styles.totals}>
            <div className={styles.totalRow}>
              <dt>Subtotal</dt>
              <dd>{brl(order.subtotal)}</dd>
            </div>
            {Number(order.deliveryFee) > 0 && (
              <div className={styles.totalRow}>
                <dt>
                  Entrega
                  {order.deliveryZoneName && (
                    <span className={styles.zone}>
                      {' '}
                      · {order.deliveryZoneName}
                    </span>
                  )}
                </dt>
                <dd>{brl(order.deliveryFee)}</dd>
              </div>
            )}
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <dt>Total</dt>
              <dd>{brl(order.totalAmount)}</dd>
            </div>
          </dl>

          {order.notes && (
            <p className={styles.notes}>
              <span className={styles.notesLabel}>Observação do cliente</span>
              {order.notes}
            </p>
          )}
        </section>

        <div className={styles.aside}>
          <Card
            className={motion.settle}
            style={riseDelay(80)}
          >
            <h2 className={styles.cardTitle}>Quem pediu</h2>
            <p className={styles.customer}>{customerNameOf(order)}</p>
            {order.guestPhone && (
              <a
                href={`tel:${order.guestPhone}`}
                className={styles.phone}
              >
                {formatPhone(order.guestPhone)}
              </a>
            )}
            {address && <p className={styles.address}>{address}</p>}
            {order.tableNumber && (
              <p className={styles.address}>Mesa {order.tableNumber}</p>
            )}
          </Card>

          <Card
            className={motion.settle}
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
                onClick={() => markPaid(order.id)}
              >
                Recebi o pagamento
              </Button>
            )}
          </Card>

          <Card
            className={motion.settle}
            style={riseDelay(200)}
          >
            <h2 className={styles.cardTitle}>Andamento</h2>
            <OrderTimeline entries={order.statusHistory} />
            {order.cancelReason && (
              <p className={styles.cancelReason}>
                Motivo do cancelamento: {order.cancelReason}
              </p>
            )}
          </Card>

          {(step || canCancel(order.status)) && (
            <section
              className={`${motion.settle} ${styles.actions}`}
              style={riseDelay(260)}
            >
              {step && (
                <Button
                  loading={isAdvancing}
                  className={`${motion.press} ${styles.advance}`}
                  onClick={() =>
                    advance({ orderId: order.id, status: step.target })
                  }
                >
                  {step.label}
                </Button>
              )}

              {canCancel(order.status) && !isCancelling && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCancelling(true)}
                >
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
                    onChange={(event) => setReason(event.target.value)}
                  />
                  <div className={styles.cancelActions}>
                    <Button
                      size="sm"
                      loading={isAdvancing}
                      disabled={reason.trim().length === 0}
                      onClick={handleCancel}
                    >
                      Confirmar cancelamento
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCancelling(false)}
                    >
                      Voltar
                    </Button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
