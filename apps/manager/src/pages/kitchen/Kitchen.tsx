import { KitchenCard } from '@compositions/KitchenCard/KitchenCard'
import type { OrderStatusKey } from '@custom_types/order/order-status-key'
import {
  KITCHEN_COLUMNS,
  KITCHEN_LOADING_CARDS,
} from '@constants/order.constants'
import { useOrders } from '@hooks/order/useOrders'
import { useOrderStatus } from '@hooks/order/useOrderStatus'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { stageOf } from '@utils/order-flow'
import { riseDelay } from '@utils/rise-delay'
import { KitchenCardSkeleton } from '@skeletons/KitchenCardSkeleton/KitchenCardSkeleton'

import styles from './Kitchen.module.css'
import motion from '@styles/motion.module.css'

export const Kitchen = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { orders, isPending } = useOrders(tenantId)
  const {
    mutate: advance,
    isPending: isAdvancing,
    variables,
  } = useOrderStatus(tenantId)

  const handleAdvance = (orderId: string, target: OrderStatusKey) =>
    advance({ orderId, status: target })

  return (
    <div className={styles.screen}>
      <div className={styles.board}>
        {KITCHEN_COLUMNS.map(({ stage, title, empty }) => {
          const list = orders.filter((order) => stageOf(order.status) === stage)

          const column = `${styles.column} ${
            stage === 'incoming' ? styles.waiting : ''
          }`

          return (
            <section key={stage} className={column} aria-label={title}>
              <header className={`${motion.unroll} ${styles.columnHead}`}>
                <h2 className={styles.columnTitle}>{title}</h2>
                <span className={styles.count}>{list.length}</span>
              </header>

              <div className={styles.stack}>
                {isPending &&
                  KITCHEN_LOADING_CARDS.map((card) => (
                    <KitchenCardSkeleton key={card} />
                  ))}

                {!isPending && list.length === 0 && (
                  <EmptyState>{empty}</EmptyState>
                )}

                {list.map((order, index) => (
                  <div key={order.id} style={riseDelay(index * 40)}>
                    <KitchenCard
                      order={order}
                      onAdvance={handleAdvance}
                      isBusy={isAdvancing && variables?.orderId === order.id}
                    />
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
