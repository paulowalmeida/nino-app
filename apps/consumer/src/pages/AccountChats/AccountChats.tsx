import { useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { OrderNotFound } from '@pages/order-tracking/components/OrderNotFound/OrderNotFound'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus/useGuestOrderStatus'
import { useScrollProgress } from '@hooks/useScrollProgress/useScrollProgress'
import type { LastOrder } from '@shared/lib/last-order/last-order'
import { readLastOrder } from '@shared/lib/last-order/last-order'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { stageIcon, stageNote } from '@utils/order-journey'
import { useStoreTracking } from '@hooks/useStoreTracking/useStoreTracking'
import { clockLabel } from '@utils/clock'

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

const NotificationsEmpty = ({ backHref }: { backHref: string }) => (
  <Box className={styles.page}>
    <Box className={styles.emptyShell}>
      <EmptyState
        size="md"
        title="Nenhuma notificação ainda"
        action={
          <Link to={backHref} className="font-bold text-brand-strong">
            Voltar para a loja
          </Link>
        }
      >
        As atualizações do seu pedido aparecem aqui durante o preparo e a
        entrega.
      </EmptyState>
    </Box>

    <Box className={styles.footer}>
      <PoweredBy compact />
    </Box>
  </Box>
)

const NotificationsSkeleton = () => (
  <Box
    className={styles.page}
    aria-busy="true"
    aria-label="Carregando notificações"
  >
    <Box className={styles.shell}>
      <Box as="header" className={styles.header}>
        <Box className={styles.skeletonBack} />
        <Box className={styles.skeletonTitle} />
      </Box>
      <Box className={styles.skeletonList}>
        <Box className={styles.skeletonCard} />
        <Box className={styles.skeletonCard} />
        <Box className={styles.skeletonCard} />
      </Box>
    </Box>
    <Box className={styles.footer}>
      <PoweredBy compact />
    </Box>
  </Box>
)

const NotificationsHeader = ({
  backHref,
  orderNumber,
}: {
  backHref: string
  orderNumber: number
}) => (
  <Box as="header" className={styles.header}>
    <Link to={backHref} className={styles.back} aria-label="Voltar para a loja">
      <Icon name="arrow-left" />
    </Link>
    <Box>
      <Heading level={1} className={styles.title}>
        Notificações
      </Heading>
      <Text as="p" className={styles.code}>
        Pedido #{orderNumber}
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

const OrderNotifications = ({ order }: { order: GuestOrderStatus }) => {
  const { stageLabel } = useStoreTracking()
  const events = notificationEvents(order)

  return (
    <Box as="section" aria-labelledby="notifications-heading">
      <Text as="p" className={styles.eyebrow}>
        Atualizações do pedido
      </Text>
      <Heading level={2} id="notifications-heading" className={styles.heading}>
        O que está acontecendo
      </Heading>

      {order.storeMessage && (
        <Box className={styles.storeMessage}>
          <Text as="p" className={styles.storeMessageLabel}>
            Mensagem da loja
          </Text>
          <Text as="p" className={styles.storeMessageBody}>
            {order.storeMessage}
          </Text>
        </Box>
      )}

      <Box as="ol" className={styles.list}>
        {events.map((event, index) => (
          <Box
            as="li"
            key={`${event.status}-${event.at}`}
            className={
              index === 0 ? `${styles.item} ${styles.itemCurrent}` : styles.item
            }
          >
            <Text as="span" className={styles.icon} aria-hidden="true">
              {stageIcon(event.status)}
            </Text>
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
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export const AccountChats = () => {
  const { slug } = useParams()
  const backHref = slug ? `/${slug}` : '/'
  const [lastOrder] = useState(() => readStoreOrder(slug))
  const progress = useScrollProgress(60)
  const {
    data: order,
    isPending,
    isError,
  } = useGuestOrderStatus(lastOrder?.orderId, lastOrder?.token)

  if (!lastOrder) return <NotificationsEmpty backHref={backHref} />

  if (isPending) return <NotificationsSkeleton />

  if (isError || !order) {
    return <OrderNotFound backHref={backHref} reason="invalid-link" />
  }

  return (
    <Box className={styles.page} style={{ '--p': progress } as CSSProperties}>
      <Box className={styles.shell}>
        <NotificationsHeader
          backHref={backHref}
          orderNumber={order.orderNumber}
        />
        <OrderNotifications order={order} />
      </Box>

      <Box className={styles.footer}>
        <PoweredBy compact />
      </Box>
    </Box>
  )
}
