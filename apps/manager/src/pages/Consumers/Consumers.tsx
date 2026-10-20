import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { ConsumersEmptyState } from '@pages/Consumers/components/ConsumersEmptyState/ConsumersEmptyState'
import { ConsumersHeader } from '@pages/Consumers/components/ConsumersHeader/ConsumersHeader'
import { ConsumersList } from '@pages/Consumers/components/ConsumersList/ConsumersList'
import { useConsumersFacade } from '@pages/Consumers/facades/useConsumersFacade/useConsumersFacade'
import { ConsumersListSkeleton } from '@pages/Consumers/skeletons/ConsumersListSkeleton/ConsumersListSkeleton'

import styles from './Consumers.module.css'

export const Consumers = () => {
  const { rows, search, isPending, isError } = useConsumersFacade()

  return (
    <Box className={styles.consumersPage}>
      <ConsumersHeader />

      {isPending && <ConsumersListSkeleton />}

      {isError && (
        <Alert variant="error">
          Não foi possível carregar a base agora. Recarregue a página.
        </Alert>
      )}

      {!isPending && !isError && rows.length === 0 && (
        <ConsumersEmptyState search={search} />
      )}

      {!isPending && !isError && rows.length > 0 && <ConsumersList />}
    </Box>
  )
}
