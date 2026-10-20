import { Alert } from '@nino/ds/components/Alert'
import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Header } from '@nino/ds/components/Header'
import { ListRow } from '@nino/ds/components/ListRow'
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
      <Box className={styles.orderDetailPage}>
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
      <Box className={styles.orderDetailPage}>
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
    <Box className={styles.orderDetailPage}>
      <Box className={styles.backBar}>
        <BackLink to={back.to}>{back.label}</BackLink>
      </Box>

      <Box as="header" className={`${motion.deal} ${styles.hero}`}>
        <Box className={styles.heroText}>
          <Eyebrow className={styles.channel}>
            {CHANNEL_LABEL[order.channel]}
          </Eyebrow>
          <Header
            level={1}
            title={`#${ticketNumber(order.orderNumber)}`}
            description={`aberto em ${stamp.format(new Date(order.createdAt))}`}
          />
        </Box>
        <Badge
          variant={toOrderBadgeVariant(order.status)}
          className={styles.orderDetailBadge}
        >
          {STATUS_LABEL[order.status]}
        </Badge>
      </Box>

      <Box className={styles.columns}>
        <Box
          as="section"
          aria-label="Itens do pedido"
          className={`${motion.deal} ${styles.receipt}`}
        >
          <ScrollArea className={styles.itemsScroll}>
            <Box as="ul" className={styles.items}>
              {order.items.map((item, index) => (
                <ListRow
                  divider="none"
                  padding={0}
                  gap={0}
                  key={item.id}
                  className={`${motion.deal} ${styles.orderDetailItem}`}
                  style={riseDelay(index * 45 + 60)}
                >
                  <Text as="span" className={styles.quantity}>
                    {item.quantity}×
                  </Text>
                  <Text as="span" className={styles.itemName}>
                    {item.product.name}
                  </Text>
                  <Text as="span" className={styles.itemPrice}>
                    {brl(Number(item.unitPrice) * item.quantity)}
                  </Text>
                </ListRow>
              ))}
            </Box>
          </ScrollArea>

          <dl className={styles.totals}>
            <Box className={styles.totalRow}>
              <dt>Subtotal</dt>
              <dd>{brl(order.subtotal)}</dd>
            </Box>
            {Number(order.deliveryFee) > 0 && (
              <Box className={styles.totalRow}>
                <dt>
                  Entrega
                  {order.deliveryZoneName && (
                    <Text as="span" className={styles.zone}>
                      {' '}
                      · {order.deliveryZoneName}
                    </Text>
                  )}
                </dt>
                <dd>{brl(order.deliveryFee)}</dd>
              </Box>
            )}
            <Box className={`${styles.totalRow} ${styles.grandTotal}`}>
              <dt>Total</dt>
              <dd>{brl(order.totalAmount)}</dd>
            </Box>
          </dl>

          {order.notes && (
            <Text className={styles.notes}>
              <Text as="span" className={styles.notesLabel}>
                Observação do cliente
              </Text>
              {order.notes}
            </Text>
          )}
        </Box>

        <OrderDetailAside />
      </Box>
    </Box>
  )
}
