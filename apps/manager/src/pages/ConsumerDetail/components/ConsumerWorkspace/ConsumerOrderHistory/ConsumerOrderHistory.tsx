import { useLocation } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import { ConsumerOrderRow } from '@pages/ConsumerDetail/components/ConsumerWorkspace/ConsumerOrderHistory/ConsumerOrderRow/ConsumerOrderRow'
import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
import { consumerFirstName } from '@pages/ConsumerDetail/utils/consumerFirstName/consumerFirstName'
import { useLoadMore } from '@shared/hooks/ui/useLoadMore/useLoadMore'

import styles from './ConsumerOrderHistory.module.css'

export const ConsumerOrderHistory = () => {
  const { pathname } = useLocation()
  const {
    consumer,
    orderRows,
    hasNextPage,
    isFetchingNextPage,
    loadMoreOrders,
  } = useConsumerDetailFacade()
  const sentinelRef = useLoadMore(!!hasNextPage, loadMoreOrders)

  if (orderRows.length === 0) {
    return <EmptyState>Nenhum pedido nos últimos 90 dias.</EmptyState>
  }

  const backToConsumer = {
    to: pathname,
    label: consumerFirstName(consumer?.name ?? 'cliente'),
  }

  return (
    <Box className={styles.consumerOrderHistoryShell}>
      <Table>
        <colgroup>
          <col className={styles.colOrder} />
          <col className={styles.colStatus} />
          <col className={styles.colDate} />
          <col className={styles.colTotal} />
        </colgroup>
        <TableHeader>
          <TableRow className={styles.headRow}>
            <TableHead>Pedido</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className={styles.colRight}>Data</TableHead>
            <TableHead className={styles.colRight}>Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orderRows.map((order, index) => (
            <ConsumerOrderRow
              key={order.href}
              order={order}
              backToConsumer={backToConsumer}
              index={index}
            />
          ))}

          {(hasNextPage || isFetchingNextPage) && (
            <TableRow className={styles.sentinelRow}>
              <TableCell colSpan={4} className={styles.sentinelCell}>
                <Box ref={sentinelRef} className={styles.sentinel}>
                  {isFetchingNextPage && (
                    <Text
                      size="xs"
                      color="faint"
                      className={styles.loadingMore}
                    >
                      Carregando mais pedidos…
                    </Text>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  )
}
