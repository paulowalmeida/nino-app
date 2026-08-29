import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { ORDERS_LOADING_TICKETS, ORDERS_STAGES } from '@pages/Orders/constants/orders.constants'
import { useOrdersFacade } from '@pages/Orders/facades/useOrdersFacade/useOrdersFacade'
import { OrderTicketSkeleton } from '@pages/Orders/skeletons/OrderTicketSkeleton/OrderTicketSkeleton'
import { OrderTicket } from '@shared/components/OrderTicket/OrderTicket'
import { useLoadMore } from '@shared/hooks/ui/useLoadMore/useLoadMore'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from '@pages/Orders/components/OrdersQueue/OrdersQueue.module.css'

export const OrdersQueue = () => {
  const {
    orders,
    isPending,
    isError,
    isSearching,
    search,
    stage,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    advanceOrder,
    isAdvancing,
    advancingOrderId,
  } = useOrdersFacade()
  const paginates = isSearching || stage === 'closed' || stage === 'table'
  const sentinelRef = useLoadMore(
    paginates && !!hasNextPage,
    () => void fetchNextPage()
  )

  if (isPending) {
    return (
      <ul className={styles.board}>
        {ORDERS_LOADING_TICKETS.map((ticket) => (
          <li key={ticket}>
            <OrderTicketSkeleton />
          </li>
        ))}
      </ul>
    )
  }

  if (isError) {
    return (
      <Alert variant="error">
        Não foi possível carregar os pedidos. Recarregue a página para tentar de
        novo.
      </Alert>
    )
  }

  if (orders.length === 0) {
    const empty = isSearching
      ? `Nenhum pedido encontrado para "${search}".`
      : (ORDERS_STAGES.find(({ id }) => id === stage)?.empty ?? '')

    return <EmptyState size="md">{empty}</EmptyState>
  }

  const handleAdvance = (orderId: string, target: OrderStatusKey) =>
    advanceOrder({ orderId, status: target })

  return (
    <>
      <Box as="ul" className={styles.board}>
        {orders.map((order, index) => (
          <li
            key={order.id}
            className={motion.settle}
            style={riseDelay(
              Math.min(index, 11) * 55 + 80
            )}
          >
            <OrderTicket
              order={order}
              onAdvance={handleAdvance}
              isBusy={isAdvancing && advancingOrderId === order.id}
            />
          </li>
        ))}
      </Box>

      {paginates && hasNextPage && (
        <div ref={sentinelRef} className={styles.sentinel}>
          {isFetchingNextPage && (
            <span className={styles.loadingMore}>Carregando mais…</span>
          )}
        </div>
      )}
    </>
  )
}
