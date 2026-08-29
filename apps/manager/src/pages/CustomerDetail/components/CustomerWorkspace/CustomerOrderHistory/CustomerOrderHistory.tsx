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
import { CustomerOrderRow } from '@pages/CustomerDetail/components/CustomerWorkspace/CustomerOrderHistory/CustomerOrderRow/CustomerOrderRow'
import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
import { customerFirstName } from '@pages/CustomerDetail/utils/customerFirstName/customerFirstName'
import { useLoadMore } from '@shared/hooks/ui/useLoadMore/useLoadMore'

import styles from './CustomerOrderHistory.module.css'

export const CustomerOrderHistory = () => {
  const { pathname } = useLocation()
  const {
    customer,
    orderRows,
    hasNextPage,
    isFetchingNextPage,
    loadMoreOrders,
  } = useCustomerDetailFacade()
  const sentinelRef = useLoadMore(!!hasNextPage, loadMoreOrders)

  if (orderRows.length === 0) {
    return <EmptyState>Nenhum pedido nos últimos 90 dias.</EmptyState>
  }

  const backToCustomer = {
    to: pathname,
    label: customerFirstName(customer?.name ?? 'cliente'),
  }

  return (
    <Box className={styles.shell}>
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
            <CustomerOrderRow
              key={order.href}
              order={order}
              backToCustomer={backToCustomer}
              index={index}
            />
          ))}

          <TableRow className={styles.sentinelRow}>
            <TableCell colSpan={4} className={styles.sentinelCell}>
              <div ref={sentinelRef} className={styles.sentinel}>
                {isFetchingNextPage && (
                  <Text size="xs" color="faint" className={styles.loadingMore}>
                    Carregando mais pedidos…
                  </Text>
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  )
}
