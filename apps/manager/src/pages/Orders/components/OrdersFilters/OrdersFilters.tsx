import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { StageTrack } from '@pages/Orders/components/StageTrack/StageTrack'
import { ORDERS_STAGES } from '@pages/Orders/constants/orders.constants'
import { useOrdersFacade } from '@pages/Orders/facades/useOrdersFacade/useOrdersFacade'
import { ordersStageOptions } from '@pages/Orders/utils/ordersStageOptions/ordersStageOptions'

import motion from '@styles/motion.module.css'
import styles from '@pages/Orders/components/OrdersFilters/OrdersFilters.module.css'

export const OrdersFilters = () => {
  const {
    summary,
    isPagePending,
    isSearching,
    search,
    stage,
    term,
    setStage,
    setTerm,
  } = useOrdersFacade()
  const stageOptions = ordersStageOptions(summary)

  if (isPagePending) {
    return (
      <Box aria-busy="true" gap={3}>
        <Text as="p" role="status" className={styles.loadingLabel}>
          Carregando filtros dos pedidos
        </Text>
        <Skeleton className={styles.skeletonSearch} />
        <Box
          aria-hidden="true"
          direction="row"
          className={`${motion.deal} ${styles.skeletonTrack}`}
        >
          {ORDERS_STAGES.map(({ id }) => (
            <Skeleton key={id} className={styles.skeletonStage} />
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <Box gap={3}>
      <Input
        type="search"
        value={term}
        placeholder="Buscar por código, nome ou telefone"
        aria-label="Buscar por código, nome ou telefone"
        className={styles.ordersFiltersSearch}
        onChange={(event) => setTerm(event.target.value)}
      />
      {isSearching ? (
        <Text
          className={`${motion.unroll} ${styles.results}`}
          aria-live="polite"
        >
          {search.length} {search.length === 1 ? 'pedido' : 'pedidos'} para
          <strong> “{search}”</strong>
          <Button
            variant="ghost"
            size="sm"
            className={motion.press}
            onClick={() => setTerm('')}
          >
            Limpar busca
          </Button>
        </Text>
      ) : (
        <Box shrink={false} className={`${motion.deal} ${styles.track}`}>
          <StageTrack stages={stageOptions} value={stage} onChange={setStage} />
        </Box>
      )}
    </Box>
  )
}
