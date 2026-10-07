import { Box } from '@nino/ds/components/Box'
import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'
import { brl } from '@shared/utils/money/money'

import { ConsumerRankingCard } from './ConsumerRankingCard/ConsumerRankingCard'

import styles from './TopConsumers.module.css'

export const TopConsumers = () => {
  const { topConsumersSpent: bySpent, topConsumersOrders: byOrders } =
    useOverviewFacade()

  const spentBars = bySpent.topConsumers.map((consumer) => ({
    id: consumer.id,
    label: consumer.name,
    value: consumer.spent,
    display: brl(consumer.spent),
  }))

  const ordersBars = byOrders.topConsumers.map((consumer) => ({
    id: consumer.id,
    label: consumer.name,
    value: consumer.orders,
    display: String(consumer.orders),
  }))

  return (
    <Box className={styles.topConsumersGrid}>
      <ConsumerRankingCard
        label="Quem mais gasta"
        isPending={bySpent.isPending}
        items={spentBars}
      />
      <ConsumerRankingCard
        label="Quem mais pede"
        isPending={byOrders.isPending}
        items={ordersBars}
      />
    </Box>
  )
}
