import { Skeleton } from '@nino/ds'

import { KitchenCard } from '@compositions/KitchenCard'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useOrders } from '@hooks/order/useOrders'
import { useOrderStatus } from '@hooks/order/useOrderStatus'
import type { OrderStage, OrderStatusKey } from '@custom_types/order'
import { riseDelay } from '@utils/rise-delay'
import { stageOf } from '@utils/order-flow'

import styles from './Kitchen.module.css'
import motion from '@styles/motion.module.css'

/**
 * A cozinha em quatro trilhos, na ordem em que o prato anda: o que chegou, o
 * que está na chapa, o que saiu para a rua e o que espera no balcão. Cada
 * trilho rola por dentro, então a tela nunca perde o cabeçalho.
 */
const COLUMNS: { stage: OrderStage; title: string; empty: string }[] = [
  { stage: 'incoming', title: 'Chegou agora', empty: 'Nada esperando aceite.' },
  { stage: 'kitchen', title: 'Na chapa', empty: 'Nenhum pedido em preparo.' },
  { stage: 'street', title: 'Saiu', empty: 'Nada na rua.' },
  { stage: 'counter', title: 'No balcão', empty: 'Nada esperando retirada.' },
]

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
        {COLUMNS.map(({ stage, title, empty }) => {
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
                {isPending && <Skeleton className={styles.skeleton} />}

                {!isPending && list.length === 0 && (
                  <p className={styles.empty}>{empty}</p>
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
