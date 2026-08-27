import { useLocation } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { ListRow } from '@nino/ds/components/ListRow'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import { CustomerOrderRow } from '@pages/CustomerDetail/components/CustomerWorkspace/CustomerOrderHistory/CustomerOrderRow/CustomerOrderRow'
import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
import { customerFirstName } from '@pages/CustomerDetail/utils/customerFirstName/customerFirstName'
import { useLoadMore } from '@shared/hooks/ui/useLoadMore/useLoadMore'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
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
    <ScrollArea className={styles.scroll}>
      <Box as="ul" gap={0}>
        {orderRows.map((order, index) => (
          <ListRow
            key={order.href}
            padding={0}
            divider={index === 0 ? 'none' : 'top'}
            className={`${motion.deal} ${styles.order}`}
            style={riseDelay(index * 40 + 80)}
          >
            <CustomerOrderRow
              order={order}
              backToCustomer={backToCustomer}
              index={index}
            />
          </ListRow>
        ))}
      </Box>

      <div ref={sentinelRef} className={styles.sentinel}>
        {isFetchingNextPage && (
          <Text size="xs" color="faint" className={styles.loadingMore}>
            Carregando mais pedidos…
          </Text>
        )}
      </div>
    </ScrollArea>
  )
}
