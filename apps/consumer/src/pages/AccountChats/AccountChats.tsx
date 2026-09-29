import { useEffect } from 'react'
import { Link, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Icon, type IconName } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus/useGuestOrderStatus'
import { useStoreTracking } from '@hooks/useStoreTracking/useStoreTracking'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { useGuestOrders } from '@shared/hooks/useGuestOrders/useGuestOrders'
import type { GuestOrderReference } from '@shared/lib/last-order/last-order'
import {
  markGuestOrderSeen,
  recordGuestOrderStatus,
} from '@shared/lib/last-order/last-order'
import { isTerminal, stageNote } from '@utils/order-journey'

import styles from './AccountChats.module.css'

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

const trackingHref = (reference: GuestOrderReference, pathSlug?: string) => {
  const base = pathSlug ? `/${pathSlug}` : ''
  return `${base}/pedido/${reference.orderId}?token=${reference.token}`
}

const OrderHeader = ({ backHref }: { backHref: string }) => (
  <Box as="header" direction="row" align="center" className={styles.header}>
    <Link to={backHref} className={styles.back} aria-label="Voltar para a loja">
      <Icon name="arrow-left" />
    </Link>
    <Box>
      <Heading level={1} className={styles.title}>
        Atualizações do pedido
      </Heading>
      <Text as="p" className={styles.subtitle}>
        Pedidos ativos e conclusões recentes neste dispositivo
      </Text>
    </Box>
  </Box>
)

const OrderEmpty = ({ backHref }: { backHref: string }) => (
  <Box className={styles.page}>
    <Box className={styles.shell}>
      <OrderHeader backHref={backHref} />
      <Box className={styles.emptyShell}>
        <Box className={styles.emptyIcon} aria-hidden="true">
          <Icon name="receipt" size="lg" />
        </Box>
        <Heading level={2} className={styles.emptyTitle}>
          Nenhum pedido para acompanhar
        </Heading>
        <Text as="p" className={styles.emptyCopy}>
          Esta área aparece quando este dispositivo tem um pedido ativo ou
          recém-concluído.
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

const OrderCardSkeleton = () => (
  <Box className={styles.cardSkeleton} aria-label="Carregando pedido" />
)

const OrderCard = ({
  reference,
  pathSlug,
}: {
  reference: GuestOrderReference
  pathSlug?: string
}) => {
  const { stageLabel } = useStoreTracking()
  const {
    data: order,
    isPending,
    isError,
  } = useGuestOrderStatus(reference.orderId, reference.token)
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
    !reference.lastSeenEventAt ||
    Date.parse(reference.lastSeenEventAt) < Date.parse(displayEventAt)

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
  const orders = useGuestOrders(slug)

  if (orders.length === 0) return <OrderEmpty backHref={backHref} />

  return (
    <Box className={styles.page}>
      <Box className={styles.shell}>
        <OrderHeader backHref={backHref} />
        <main className={styles.content}>
          <Box className={styles.list} aria-label="Pedidos deste dispositivo">
            {orders.map((reference) => (
              <OrderCard
                key={reference.orderId}
                reference={reference}
                pathSlug={slug}
              />
            ))}
          </Box>
          <Text as="p" className={styles.retentionNote}>
            Pedidos concluídos permanecem aqui por 7 dias. Para acessar em outro
            dispositivo, use o link recebido da loja.
          </Text>
        </main>
      </Box>
      <Box className={styles.footer}>
        <PoweredBy compact />
      </Box>
    </Box>
  )
}
