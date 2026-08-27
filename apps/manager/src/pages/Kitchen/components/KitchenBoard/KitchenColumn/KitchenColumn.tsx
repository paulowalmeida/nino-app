import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { KITCHEN_LOADING_CARDS } from '@pages/Kitchen/constants/kitchen.constants'
import { useKitchenFacade } from '@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade'
import { KitchenCardSkeleton } from '@pages/Kitchen/skeletons/KitchenCardSkeleton/KitchenCardSkeleton'
import { KitchenCard } from '@shared/components/KitchenCard/KitchenCard'
import type { OrderStage } from '@shared/types/order/order-stage'
import { stageOf } from '@shared/utils/order-stage/order-stage'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './KitchenColumn.module.css'

export type KitchenColumnProps = {
  stage: OrderStage
  title: string
  empty: string
}

export const KitchenColumn = ({ stage, title, empty }: KitchenColumnProps) => {
  const { orders, isPending, advanceOrder, isAdvancing, advancingOrderId } =
    useKitchenFacade()
  const ordersInStage = orders.filter(
    (order) => stageOf(order.status) === stage
  )
  const columnClassName = `${styles.column} ${stage === 'incoming' ? styles.waiting : ''}`

  return (
    <Box as="section" className={columnClassName} aria-label={title}>
      <Box as="header" className={`${motion.unroll} ${styles.columnHead}`}>
        <Heading level={2} className={styles.columnTitle}>
          {title}
        </Heading>
        <Text as="span" className={styles.count}>
          {ordersInStage.length}
        </Text>
      </Box>

      <Box className={styles.stack}>
        {isPending &&
          KITCHEN_LOADING_CARDS.map((card) => (
            <KitchenCardSkeleton key={card} />
          ))}

        {!isPending && ordersInStage.length === 0 && (
          <EmptyState>{empty}</EmptyState>
        )}

        {ordersInStage.map((order, index) => (
          <Box key={order.id} style={riseDelay(index * 40)}>
            <KitchenCard
              order={order}
              onAdvance={advanceOrder}
              isBusy={isAdvancing && advancingOrderId === order.id}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
