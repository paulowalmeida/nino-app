import { useState } from 'react'
import { Link, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Icon, type IconName } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus/useGuestOrderStatus'
import { OrderNotFound } from '@pages/order-tracking/components/OrderNotFound/OrderNotFound'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import type { LastOrder } from '@shared/lib/last-order/last-order'
import { readLastOrder } from '@shared/lib/last-order/last-order'
import { clockLabel } from '@utils/clock'
import { isTerminal, stageNote } from '@utils/order-journey'
import { useStoreTracking } from '@hooks/useStoreTracking/useStoreTracking'

import styles from './AccountChats.module.css'

const notificationDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const readStoreOrder = (slug: string | undefined): LastOrder | null => {
  const order = readLastOrder()

  if (!order || (slug && order.slug && order.slug !== slug)) return null

  return order
}

const OrderEmpty = ({ backHref }: { backHref: string }) => (
  <Box className={styles.page}>
    <Box className={styles.shell}>
      <OrderHeader backHref={backHref} />
      <Box className={styles.emptyShell}>
        <Box className={styles.emptyIcon} aria-hidden="true">
          <Icon name="receipt" size="lg" />
        </Box>
        <Heading level={2} className={styles.emptyTitle}>
          Nenhum pedido recente
        </Heading>
        <Text as="p" className={styles.emptyCopy}>
          Seu próximo pedido e as atualizações da loja vão aparecer aqui.
        </Text>
        <Link to={backHref} className={styles.emptyAction}>
          Ver cardápio
          <Icon name="arrow-right" size="sm" />
        </Link>
      </Box>
    </Box>

    <Box className={styles.footer}>
      <PoweredBy compact />
    </Box>
  </Box>
)

const OrderSkeleton = () => (
  <Box className={styles.page} aria-busy="true" aria-label="Carregando pedido">
    <Box className={styles.shell}>
      <Box as="header" direction="row" align="center" className={styles.header}>
        <Box className={styles.skeletonBack} />
        <Box>
          <Box className={styles.skeletonTitle} />
          <Box className={styles.skeletonSubtitle} />
        </Box>
      </Box>
      <Box className={styles.skeletonSummary} />
      <Box className={styles.skeletonList}>
        <Box className={styles.skeletonRow} />
        <Box className={styles.skeletonRow} />
        <Box className={styles.skeletonRow} />
      </Box>
    </Box>
    <Box className={styles.footer}>
      <PoweredBy compact />
    </Box>
  </Box>
)

const OrderHeader = ({ backHref }: { backHref: string }) => (
  <Box as="header" direction="row" align="center" className={styles.header}>
    <Link to={backHref} className={styles.back} aria-label="Voltar para a loja">
      <Icon name="arrow-left" />
    </Link>
    <Box>
      <Heading level={1} className={styles.title}>
        Seu pedido
      </Heading>
      <Text as="p" className={styles.subtitle}>
        Acompanhe o andamento e consulte o histórico
      </Text>
    </Box>
  </Box>
)

const notificationEvents = (order: GuestOrderStatus) => {
  const events =
    order.timeline.length > 0
      ? order.timeline
      : [{ status: order.status, at: order.createdAt }]

  return [...events].reverse()
}

const notificationIcon = (status: GuestOrderStatus['status']): IconName => {
  const icons: Record<GuestOrderStatus['status'], IconName> = {
    PENDING: 'clock',
    ACCEPTED: 'receipt',
    PREPARING: 'chef-hat',
    OUT_FOR_DELIVERY: 'truck',
    READY_FOR_PICKUP: 'shopping-bag',
    DELIVERED: 'check-circle',
    COMPLETED: 'check-circle',
    CANCELLED: 'x-circle',
  }

  return icons[status]
}

const OrderNotifications = ({
  order,
  trackingHref,
}: {
  order: GuestOrderStatus
  trackingHref: string
}) => {
  const { stageLabel } = useStoreTracking()
  const events = notificationEvents(order)
  const currentTitle = stageLabel(order.status)
  const resolved = isTerminal(order.status)

  return (
    <main className={styles.content}>
      <Box
        as="section"
        className={`${styles.activeOrder} ${resolved ? styles.resolvedOrder : ''}`}
        aria-labelledby="order-summary-heading"
      >
        <Box direction="row" align="start" className={styles.activeOrderMain}>
          <Box className={styles.activeOrderIcon} aria-hidden="true">
            <Icon name={notificationIcon(order.status)} size="md" />
          </Box>
          <Box className={styles.activeOrderCopy}>
            <Text as="p" className={styles.orderReference}>
              Pedido #{order.orderNumber}
            </Text>
            <Heading
              level={2}
              id="order-summary-heading"
              className={styles.activeOrderTitle}
            >
              {currentTitle}
            </Heading>
            <Text as="p" className={styles.activeOrderBody}>
              {stageNote(order, order.status)}
            </Text>
          </Box>
        </Box>
        <Link to={trackingHref} className={styles.trackLink}>
          {resolved ? 'Ver detalhes do pedido' : 'Acompanhar pedido'}
          <Icon name="arrow-right" size="sm" />
        </Link>
      </Box>

      <Box
        as="section"
        className={styles.feed}
        aria-labelledby="updates-heading"
      >
        <Heading level={2} id="updates-heading" className={styles.feedTitle}>
          Histórico do pedido
        </Heading>
        <Text as="p" className={styles.feedDescription}>
          {resolved
            ? 'O registro completo deste pedido.'
            : 'As mudanças mais recentes aparecem primeiro.'}
        </Text>

        <Box as="ol" className={styles.list}>
          {order.storeMessage && (
            <Box
              as="li"
              direction="row"
              align="start"
              className={`${styles.item} ${styles.storeMessage}`}
            >
              <Box className={styles.icon} aria-hidden="true">
                <Icon name="message-circle" size="sm" />
              </Box>
              <Box className={styles.copy}>
                <Text as="p" className={styles.itemTitle}>
                  Mensagem da loja
                </Text>
                <Text as="p" className={styles.itemBody}>
                  {order.storeMessage}
                </Text>
              </Box>
            </Box>
          )}
          {events.map((event, index) => (
            <Box
              as="li"
              direction="row"
              align="start"
              key={`${event.status}-${event.at}`}
              className={styles.item}
            >
              <Box className={styles.icon} aria-hidden="true">
                <Icon name={notificationIcon(event.status)} size="sm" />
              </Box>
              <Box className={styles.copy}>
                <Text as="p" className={styles.itemTitle}>
                  {stageLabel(event.status)}
                </Text>
                <Text as="p" className={styles.itemBody}>
                  {stageNote(order, event.status)}
                </Text>
                <time
                  className={styles.time}
                  dateTime={event.at}
                  title={notificationDate.format(new Date(event.at))}
                >
                  {clockLabel(event.at)}
                </time>
              </Box>
              {index === 0 && !resolved && (
                <Box className={styles.currentDot} aria-hidden="true" />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </main>
  )
}

export const AccountChats = () => {
  const { slug } = useParams()
  const backHref = slug ? `/${slug}` : '/'
  const [lastOrder] = useState(() => readStoreOrder(slug))
  const trackingHref = slug
    ? `/${slug}/pedido/${lastOrder?.orderId}?token=${lastOrder?.token}`
    : `/pedido/${lastOrder?.orderId}?token=${lastOrder?.token}`
  const {
    data: order,
    isPending,
    isError,
  } = useGuestOrderStatus(lastOrder?.orderId, lastOrder?.token)

  if (!lastOrder) return <OrderEmpty backHref={backHref} />

  if (isPending) return <OrderSkeleton />

  if (isError || !order) {
    return <OrderNotFound backHref={backHref} reason="invalid-link" />
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.shell}>
        <OrderHeader backHref={backHref} />
        <OrderNotifications order={order} trackingHref={trackingHref} />
      </Box>

      <Box className={styles.footer}>
        <PoweredBy compact />
      </Box>
    </Box>
  )
}
