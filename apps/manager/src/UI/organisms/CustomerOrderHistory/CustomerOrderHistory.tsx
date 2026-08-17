import { Link, useLocation } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { ListRow } from '@nino/ds/components/ListRow'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import { STATUS_LABEL } from '@constants/order.constants'
import { useCustomerOrders } from '@hooks/customer/useCustomerOrders'
import { useLoadMore } from '@hooks/ui/useLoadMore'
import { brl } from '@utils/money'
import { statusBadgeVariant } from '@utils/order-badge'
import { ticketNumber } from '@utils/order-flow'
import { riseDelay } from '@utils/rise-delay'

import styles from './CustomerOrderHistory.module.css'
import motion from '@styles/motion.module.css'

type CustomerOrderHistoryProps = {
  tenantId: string | null
  customerId: string
  /** Nome de quem o pedido aberto daqui volta pra ficha dizendo "voltar pra" */
  customerName: string
}

const firstNameOf = (name: string): string => name.trim().split(' ')[0]

const stamp = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const CustomerOrderHistory = ({
  tenantId,
  customerId,
  customerName,
}: CustomerOrderHistoryProps) => {
  const { orders, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useCustomerOrders(tenantId, customerId)

  const sentinelRef = useLoadMore(!!hasNextPage, () => void fetchNextPage())

  const { pathname } = useLocation()
  const backToCustomer = { to: pathname, label: firstNameOf(customerName) }

  if (orders.length === 0) {
    return <EmptyState>Nenhum pedido nos últimos 90 dias.</EmptyState>
  }

  return (
    <ScrollArea className={styles.scroll}>
      <Flexbox as="ul" gap={0}>
        {orders.map((order, index) => (
          <ListRow
            key={order.id}
            padding={0}
            divider={index === 0 ? 'none' : 'top'}
            className={`${motion.deal} ${styles.order}`}
            style={riseDelay(index * 40 + 80)}
          >
            <Link
              to={`../../pedidos/${order.id}`}
              relative="path"
              state={{ from: backToCustomer }}
              className={`${motion.lift} ${styles.orderLink}`}
            >
              <span className={styles.orderNumber}>
                #{ticketNumber(order.id)}
              </span>
              <Badge
                size="sm"
                variant={statusBadgeVariant(order.status)}
                className={styles.orderStatus}
              >
                {STATUS_LABEL[order.status]}
              </Badge>
              <time className={styles.orderAt} dateTime={order.createdAt}>
                {stamp.format(new Date(order.createdAt))}
              </time>
              <span className={styles.orderTotal}>
                {brl(order.totalAmount)}
              </span>
            </Link>
          </ListRow>
        ))}
      </Flexbox>

      {/* sentinela: entra em cena e puxa a próxima página sozinha */}
      <div ref={sentinelRef} className={styles.sentinel}>
        {isFetchingNextPage && (
          <Text className={styles.loadingMore}>Carregando mais pedidos…</Text>
        )}
      </div>
    </ScrollArea>
  )
}
