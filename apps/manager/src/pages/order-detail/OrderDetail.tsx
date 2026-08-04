import { useState } from 'react'
import { useParams } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Badge } from '@nino/ds/components/Badge'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import {
  OrderDetailAside,
} from '@compositions/OrderDetailAside/OrderDetailAside'
import { BackLink } from '@elements/BackLink/BackLink'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useOrder } from '@hooks/order/useOrder'
import { useOrderPayment } from '@hooks/order/useOrderPayment'
import { useOrderStatus } from '@hooks/order/useOrderStatus'
import { OrderDetailSkeleton } from '@skeletons/OrderDetailSkeleton/OrderDetailSkeleton'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'
import { statusBadgeVariant } from '@utils/order-badge'
import { CHANNEL_LABEL, STATUS_LABEL, ticketNumber } from '@utils/order-flow'

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

  if (isPending) return <OrderDetailSkeleton />

  if (!order) {
    return (
      <div className={styles.page}>
        <div className={styles.backBar}>
          <BackLink>Pedidos</BackLink>
        </div>
        <Alert variant="info">
          Este pedido não está mais nesta loja. Ele pode ter sido removido.
        </Alert>
      </div>
    )
  }

  const handleCancel = () => {
    advance({ orderId: order.id, status: 'CANCELLED', cancelReason: reason })
    setCancelling(false)
    setReason('')
  }

  return (
    <div className={styles.page}>
      <div className={styles.backBar}>
        <BackLink>Pedidos</BackLink>
      </div>

      <header className={`${motion.settle} ${styles.hero}`}>
          <div className={styles.heroText}>
            <Eyebrow className={styles.channel}>
              {CHANNEL_LABEL[order.channel]}
            </Eyebrow>
            <h1 className={`${motion.land} ${styles.number}`}>
              #{ticketNumber(order.id)}
            </h1>
            <p className={styles.opened}>
              aberto em {stamp.format(new Date(order.createdAt))}
            </p>
          </div>
        <Badge
          variant={statusBadgeVariant(order.status)}
          className={styles.badge}
        >
          {STATUS_LABEL[order.status]}
        </Badge>
      </header>

        <div className={styles.columns}>
          <section
            aria-label="Itens do pedido"
            className={`${motion.unroll} ${styles.receipt}`}
          >
              <ScrollArea className={styles.itemsScroll}>
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
              </ScrollArea>

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
                  <span className={styles.notesLabel}>
                    Observação do cliente
                  </span>
                  {order.notes}
                </p>
              )}
          </section>

          <OrderDetailAside
            order={order}
            isAdvancing={isAdvancing}
            isPaying={isPaying}
            isCancelling={isCancelling}
            reason={reason}
            onReasonChange={setReason}
            onMarkPaid={() => markPaid(order.id)}
            onAdvance={(status) => advance({ orderId: order.id, status })}
            onStartCancel={() => setCancelling(true)}
            onConfirmCancel={handleCancel}
            onAbortCancel={() => setCancelling(false)}
          />
        </div>
    </div>
  )
}
