import { useEffect } from 'react'
import { Link, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Icon, type IconName } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import {
  useConsumerSession,
} from '@shared/hooks/useConsumerSession/useConsumerSession'
import {
  useGuestOrderStatus,
} from '@hooks/useGuestOrderStatus/useGuestOrderStatus'
import { useMyOrders } from '@shared/hooks/useMyOrders/useMyOrders'
import { useStoreTracking } from '@hooks/useStoreTracking/useStoreTracking'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { useGuestOrders } from '@shared/hooks/useGuestOrders/useGuestOrders'
import {
  useConsumerNotifications,
} from '@shared/hooks/useConsumerNotifications/useConsumerNotifications'
import {
  markGuestOrderSeen,
  recordGuestOrderStatus,
} from '@shared/lib/last-order/last-order'
import { isTerminal, stageNote } from '@utils/order-journey'

import {
  StoreNotificationCard,
} from './components/StoreNotificationCard/StoreNotificationCard'
import styles from './AccountChats.module.css'

/**
 * Um cartão só sabe acompanhar um pedido: com token (convidado, link do
 * WhatsApp) ou por sessão (cliente logado, sem token nenhum para guardar).
 * `lastSeenEventAt` ausente marca a segunda origem — o navegador não tem
 * onde guardar "já vi isto" para um pedido que não é dele, então o cartão
 * nunca acende "Nova atualização" nesse caso.
 */
type OrderRow = {
  orderId: string
  token?: string
  lastSeenEventAt?: string | null
}

const orderDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const orderIcon = (status: GuestOrderStatus['status']): IconName => {
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

const latestEventAt = (order: GuestOrderStatus) =>
  order.timeline.at(-1)?.at ?? order.createdAt

const trackingHref = (reference: OrderRow, pathSlug?: string) => {
  const base = pathSlug ? `/${pathSlug}` : ''
  const query = reference.token ? `?token=${reference.token}` : ''
  return `${base}/pedido/${reference.orderId}${query}`
}

const OrderHeader = ({ backHref }: { backHref: string }) => (
  <Box as="header" direction="row" align="center" className={styles.accountChatsHeader}>
    <Link to={backHref} className={styles.back} aria-label="Voltar para a loja">
      <Icon name="arrow-left" />
    </Link>
    <Box>
      <Heading level={1} className={styles.accountChatsTitle}>
        Atualizações do pedido
      </Heading>
      <Text as="p" className={styles.accountChatsSubtitle}>
        Pedidos em andamento e conclusões recentes
      </Text>
    </Box>
  </Box>
)

const OrderEmpty = ({ backHref }: { backHref: string }) => (
  <Box className={styles.accountChatsPage}>
    <Box className={styles.accountChatsShell}>
      <OrderHeader backHref={backHref} />
      <Box className={styles.emptyShell}>
        <Box className={styles.emptyIcon} aria-hidden="true">
          <Icon name="receipt" size="lg" />
        </Box>
        <Heading level={2} className={styles.emptyTitle}>
          Nenhum pedido para acompanhar
        </Heading>
        <Text as="p" className={styles.emptyCopy}>
          Esta área aparece quando há um pedido em andamento, recém-concluído
          ou um aviso da loja.
        </Text>
        <Link to={backHref} className={styles.emptyAction}>
          Ver cardápio
          <Icon name="arrow-right" size="sm" />
        </Link>
      </Box>
    </Box>
    <Box className={styles.accountChatsFooter}>
      <PoweredBy compact />
    </Box>
  </Box>
)

const OrderCardSkeleton = () => (
  <Box className={styles.cardSkeleton} aria-label="Carregando pedido" />
)

const OrderCard = ({
  reference,
  pathSlug,
  hasSession,
}: {
  reference: OrderRow
  pathSlug?: string
  hasSession: boolean
}) => {
  const { stageLabel } = useStoreTracking()
  const {
    data: order,
    isPending,
    isError,
  } = useGuestOrderStatus(reference.orderId, reference.token, hasSession)
  const eventAt = order ? latestEventAt(order) : null

  useEffect(() => {
    if (!order || !eventAt) return
    recordGuestOrderStatus(order.id, order.status, eventAt)
    markGuestOrderSeen(order.id, eventAt)
  }, [eventAt, order])

  if (isPending) return <OrderCardSkeleton />

  if (isError || !order) {
    return (
      <Box as="article" className={styles.orderCard}>
        <Heading level={2} className={styles.orderTitle}>
          Não foi possível atualizar este pedido
        </Heading>
        <Text className={styles.orderBody}>
          Confira sua conexão ou abra os detalhes para tentar novamente.
        </Text>
        <Link
          to={trackingHref(reference, pathSlug)}
          className={styles.cardLink}
        >
          Abrir pedido
          <Icon name="arrow-right" size="sm" />
        </Link>
      </Box>
    )
  }

  const resolved = isTerminal(order.status)
  const displayEventAt = eventAt ?? order.createdAt
  const unread =
    reference.lastSeenEventAt !== undefined &&
    (!reference.lastSeenEventAt ||
      Date.parse(reference.lastSeenEventAt) < Date.parse(displayEventAt))

  return (
    <Box
      as="article"
      className={`${styles.orderCard} ${resolved ? styles.resolvedCard : ''}`}
      aria-labelledby={`order-${order.id}`}
    >
      <Box direction="row" align="start" className={styles.orderMain}>
        <Box className={styles.orderIcon} aria-hidden="true">
          <Icon name={orderIcon(order.status)} size="md" />
        </Box>
        <Box className={styles.orderCopy}>
          <Box direction="row" align="center" className={styles.orderMeta}>
            <Text as="p" className={styles.orderReference}>
              Pedido #{order.orderNumber}
            </Text>
            {unread && !resolved && (
              <Text as="span" className={styles.unreadLabel}>
                Nova atualização
              </Text>
            )}
          </Box>
          <Heading
            level={2}
            id={`order-${order.id}`}
            className={styles.orderTitle}
          >
            {stageLabel(order.status)}
          </Heading>
          <Text as="p" className={styles.orderBody}>
            {stageNote(order, order.status)}
          </Text>
          <time className={styles.orderTime} dateTime={displayEventAt}>
            Atualizado em {orderDate.format(new Date(displayEventAt))}
          </time>
        </Box>
      </Box>
      <Link to={trackingHref(reference, pathSlug)} className={styles.cardLink}>
        {resolved ? 'Ver recibo e detalhes' : 'Acompanhar pedido'}
        <Icon name="arrow-right" size="sm" />
      </Link>
    </Box>
  )
}

export const AccountChats = () => {
  const { slug } = useParams()
  const backHref = slug ? `/${slug}` : '/'
  const { consumer } = useConsumerSession()
  const guestOrders = useGuestOrders(slug)
  const { data: myOrders } = useMyOrders(!!consumer)
  const { data: storeNotifications, markRead } = useConsumerNotifications(
    !!consumer
  )
  const notifications = storeNotifications ?? []

  /* WHY: quem tem conta já enxerga o histórico completo em /conta/pedidos —
     aqui só o pedido em andamento interessa, sem duplicar a lista inteira. */
  const activeMyOrders = (myOrders ?? [])
    .filter((order) => !isTerminal(order.status))
    .map((order): OrderRow => ({ orderId: order.id }))

  const orders: OrderRow[] = [...guestOrders, ...activeMyOrders]

  if (orders.length === 0 && notifications.length === 0) {
    return <OrderEmpty backHref={backHref} />
  }

  return (
    <Box className={styles.accountChatsPage}>
      <Box className={styles.accountChatsShell}>
        <OrderHeader backHref={backHref} />
        <main className={styles.accountChatsContent}>
          {orders.length > 0 && (
            <Box className={styles.accountChatsList} aria-label="Pedidos deste dispositivo">
              {orders.map((reference) => (
                <OrderCard
                  key={reference.orderId}
                  reference={reference}
                  pathSlug={slug}
                  hasSession={!!consumer}
                />
              ))}
            </Box>
          )}
          {notifications.length > 0 && (
            <Box
              className={
                orders.length > 0
                  ? `${styles.accountChatsList} ${styles.listSpaced}`
                  : styles.accountChatsList
              }
              aria-label="Avisos da loja"
            >
              {notifications.map((notification) => (
                <StoreNotificationCard
                  key={notification.id}
                  notification={notification}
                  onSeen={markRead}
                />
              ))}
            </Box>
          )}
          {guestOrders.length > 0 && (
            <Text as="p" className={styles.retentionNote}>
              Pedidos concluídos permanecem aqui por 7 dias. Para acessar em
              outro dispositivo, use o link recebido da loja.
            </Text>
          )}
        </main>
      </Box>
      <Box className={styles.accountChatsFooter}>
        <PoweredBy compact />
      </Box>
    </Box>
  )
}
