import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { CustomersHeader } from '@pages/Customers/components/CustomersHeader/CustomersHeader'
import { CustomersList } from '@pages/Customers/components/CustomersList/CustomersList'
import { useCustomersFacade } from '@pages/Customers/facades/useCustomersFacade/useCustomersFacade'
import { CustomersListSkeleton } from '@pages/Customers/skeletons/CustomersListSkeleton/CustomersListSkeleton'
import { customersEmptyMessage } from '@pages/Customers/utils/customersEmptyMessage/customersEmptyMessage'

import motion from '@styles/motion.module.css'
import styles from './Customers.module.css'

export const Customers = () => {
  const { rows, search, isPending, isError } = useCustomersFacade()

  return (
    <Box className={styles.page}>
      <CustomersHeader />

      {isPending && <CustomersListSkeleton />}

      {isError && (
        <Alert variant="error">
          Não foi possível carregar a base agora. Recarregue a página.
        </Alert>
      )}

      {!isPending && !isError && rows.length === 0 && (
        <EmptyState className={`${motion.unroll} ${styles.empty}`}>
          {customersEmptyMessage(search)}
        </EmptyState>
      )}

      {rows.length > 0 && <CustomersList />}
    </Box>
  )
}
