import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { ListRow } from '@nino/ds/components/ListRow'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { Text } from '@nino/ds/components/Text'
import {
  ORDERS_LOADING_TICKETS,
  ORDERS_STAGES,
} from '@pages/Orders/constants/orders.constants'
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
    isOrdersPending,
    isPagePending,
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
  const [phase, setPhase] = useState<'idle' | 'loading' | 'revealing'>('idle')
  const [minimumElapsed, setMinimumElapsed] = useState(true)
  const [hasSwitchedStage, setHasSwitchedStage] = useState(false)
  const previousStage = useRef(stage)
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useLayoutEffect(() => {
    if (previousStage.current === stage) return
    previousStage.current = stage
    if (transitionTimer.current) clearTimeout(transitionTimer.current)
    setHasSwitchedStage(true)
    setPhase('loading')
    setMinimumElapsed(false)
    transitionTimer.current = setTimeout(() => setMinimumElapsed(true), 180)
  }, [stage])

  useEffect(() => {
    if (
      phase !== 'loading' ||
      !minimumElapsed ||
      isOrdersPending ||
      isPagePending ||
      isError
    ) {
      return
    }

    if (orders.length === 0) {
      setPhase('idle')
      return
    }

    setPhase('revealing')
    transitionTimer.current = setTimeout(() => {
      setPhase('idle')
      transitionTimer.current = null
    }, 420)
  }, [phase, minimumElapsed, isOrdersPending, isPagePending, isError, orders.length])

  useEffect(
    () => () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current)
    },
    []
  )

  const paginates = isSearching || stage === 'closed' || stage === 'table'
  const sentinelRef = useLoadMore(
    paginates && !!hasNextPage,
    () => void fetchNextPage()
  )

  const renderSkeletonBoard = (keys: string[]) => (
    <Box as="ul" className={styles.board} aria-hidden="true">
      {keys.map((ticket) => (
        <ListRow divider="none" padding={0} gap={0} key={ticket}>
          <OrderTicketSkeleton />
        </ListRow>
      ))}
    </Box>
  )

  if (isError) {
    return (
      <Box className={styles.scrollArea}>
        <Box className={styles.feedback}>
          <Alert variant="error">
            Não foi possível carregar os pedidos. Recarregue a página para
            tentar de novo.
          </Alert>
        </Box>
      </Box>
    )
  }

  if (isPending || isPagePending || phase === 'loading') {
    return (
      <Box aria-busy="true" className={styles.scrollArea}>
        <Text as="p" role="status" className={styles.loadingLabel}>
          Carregando pedidos
        </Text>
        {renderSkeletonBoard(ORDERS_LOADING_TICKETS)}
      </Box>
    )
  }

  if (orders.length === 0) {
    const empty = isSearching
      ? `Nenhum pedido encontrado para "${search}".`
      : (ORDERS_STAGES.find(({ id }) => id === stage)?.empty ?? '')

    return (
      <Box className={styles.scrollArea}>
        <Box className={styles.feedback}>
          <EmptyState
            size="md"
            illustration={isSearching ? undefined : <NinoMascot />}
          >
            {empty}
          </EmptyState>
        </Box>
      </Box>
    )
  }

  const handleAdvance = (orderId: string, target: OrderStatusKey) =>
    advanceOrder({ orderId, status: target })

  return (
    <Box className={styles.scrollArea}>
      <Box className={styles.resultTransition}>
        <Box as="ul" className={styles.board}>
          {orders.map((order, index) => (
            <ListRow
              divider="none"
              padding={0}
              gap={0}
              key={order.id}
              className={
                phase === 'revealing'
                  ? motion.chipCardEnter
                  : hasSwitchedStage
                    ? undefined
                    : motion.deal
              }
              style={
                phase === 'revealing'
                  ? { animationDelay: `${20 + Math.min(index, 5) * 20}ms` }
                  : hasSwitchedStage
                    ? undefined
                    : riseDelay(Math.min(index, 11) * 55 + 80)
              }
            >
              <OrderTicket
                order={order}
                onAdvance={handleAdvance}
                isBusy={isAdvancing && advancingOrderId === order.id}
              />
            </ListRow>
          ))}
        </Box>
        {phase === 'revealing' && (
          <Box
            className={styles.skeletonOverlay}
            aria-hidden="true"
            data-testid="orders-chip-skeleton"
          >
            {renderSkeletonBoard(orders.map(({ id }) => id))}
          </Box>
        )}
      </Box>

      {paginates && hasNextPage && (
        <Box ref={sentinelRef} className={styles.sentinel}>
          {isFetchingNextPage && (
            <Text as="span" className={styles.loadingMore}>
              Carregando mais…
            </Text>
          )}
        </Box>
      )}
    </Box>
  )
}
