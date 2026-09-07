import { Alert } from '@nino/ds/components/Alert'
import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Heading } from '@nino/ds/components/Heading'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import { OrderDetailAside } from '@pages/OrderDetail/components/OrderDetailAside/OrderDetailAside'
import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'
import { OrderDetailSkeleton } from '@pages/OrderDetail/skeletons/OrderDetailSkeleton/OrderDetailSkeleton'
import { toOrderBadgeVariant } from '@shared/adapters/order-badge.adapter/order-badge.adapter'
import { BackLink } from '@shared/components/BackLink/BackLink'
import { CHANNEL_LABEL, STATUS_LABEL } from '@shared/constants/order.constants'
import { useBackTarget } from '@shared/hooks/ui/useBackTarget/useBackTarget'
import { brl } from '@shared/utils/money/money'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from '@pages/OrderDetail/OrderDetail.module.css'

const stamp = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export const OrderDetail = () => {
  const back = useBackTarget({ to: '..', label: 'Pedidos' })
  const { order, isPending, isError } = useOrderDetailFacade()

  if (isPending) return <OrderDetailSkeleton />

  if (isError) {
    return (
      <Box className={styles.page}>
        <Box className={styles.backBar}>
          <BackLink to={back.to}>{back.label}</BackLink>
        </Box>
        <Alert variant="error">
          Não foi possível carregar este pedido. Tente novamente.
        </Alert>
      </Box>
    )
  }

  if (!order) {
    return (
      <Box className={styles.page}>
        <Box className={styles.backBar}>
          <BackLink to={back.to}>{back.label}</BackLink>
        </Box>
        <Alert variant="info">
          Este pedido não está mais nesta loja. Ele pode ter sido removido.
        </Alert>
      </Box>
    )
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.backBar}>
        <BackLink to={back.to}>{back.label}</BackLink>
      </Box>

      <header className={`${motion.settle} ${styles.hero}`}>
        <div className={styles.heroText}>
          <Eyebrow className={styles.channel}>
            {CHANNEL_LABEL[order.channel]}
          </Eyebrow>
          <Heading level={1} className={`${motion.land} ${styles.number}`}>
            #{ticketNumber(order.orderNumber)}
          </Heading>
          <Text className={styles.opened}>
            aberto em {stamp.format(new Date(order.createdAt))}
          </Text>
        </div>
        <Badge
          variant={toOrderBadgeVariant(order.status)}
          className={styles.badge}
        >
          {STATUS_LABEL[order.status]}
        </Badge>
      </header>

      <Box className={styles.columns}>
        <section
          aria-label="Itens do pedido"
          className={`${motion.unroll} ${styles.receipt}`}
        >
          <ScrollArea className={styles.itemsScroll}>
            <Box as="ul" className={styles.items}>
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
            </Box>
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
              <span className={styles.notesLabel}>Observação do cliente</span>
              {order.notes}
            </p>
          )}
        </section>

        <OrderDetailAside />
      </Box>
    </Box>
  )
}
