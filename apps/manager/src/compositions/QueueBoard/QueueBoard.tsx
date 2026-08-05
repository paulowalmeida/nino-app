import { Link } from 'react-router'

import { Card } from '@nino/ds/components/Card'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { CountUp } from '@nino/ds/components/CountUp'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { riseDelay } from '@utils/rise-delay'
import type { OrderQueueSummary } from '@custom_types/order/order-queue-summary'
import type { OrderStage } from '@custom_types/order/order-stage'
import styles from './QueueBoard.module.css'
import motion from '@styles/motion.module.css'
import tile from '@styles/statTile.module.css'

const sumByKeys = (summary: OrderQueueSummary | undefined, ...keys: string[]) =>
  keys.reduce(
    (total, key) => total + (summary?.[key as keyof OrderQueueSummary] ?? 0),
    0
  )

export type QueueBoardProps = {
  tenantId: string | null
}

export const QueueBoard = ({ tenantId }: QueueBoardProps) => {
  const { data, isPending } = useQueueSummary(tenantId)

  const waiting = sumByKeys(data, 'PENDING')

  /** Each tile is the same stage the order queue filters by. */
  const tiles: {
    label: string
    value: number
    stage: OrderStage
    urgent?: boolean
  }[] = [
    {
      label: 'esperando aceite',
      value: waiting,
      stage: 'incoming',
      urgent: waiting > 0,
    },
    {
      label: 'confirmados',
      value: sumByKeys(data, 'ACCEPTED'),
      stage: 'confirmed',
    },
    {
      label: 'na cozinha',
      value: sumByKeys(data, 'PREPARING'),
      stage: 'kitchen',
    },
    {
      label: 'saíram para entrega',
      value: sumByKeys(data, 'OUT_FOR_DELIVERY'),
      stage: 'street',
    },
    {
      label: 'prontos para retirada',
      value: sumByKeys(data, 'READY_FOR_PICKUP'),
      stage: 'counter',
    },
  ]

  const isIdle = !isPending && tiles.every(({ value }) => value === 0)

  return (
    <section aria-label="Fila de pedidos">
      <div className={motion.unroll}>
        <Eyebrow className={styles.heading}>Agora na loja</Eyebrow>
      </div>

      <div className={styles.board}>
        {tiles.map(({ label, value, stage, urgent }, index) => (
          <Card
            key={label}
            asChild
            className={`${motion.settle} ${motion.lift} ${
              urgent ? `${styles.tile} ${styles.urgent}` : styles.tile
            }`}
          >
            <Link
              to={`../pedidos?etapa=${stage}`}
              relative="path"
              aria-label={`Ver pedidos ${label}`}
              style={riseDelay(index * 70 + 80)}
              className={tile.cardOverview}
            >
              <span className={styles.value}>
                {isPending ? (
                  <Skeleton className={styles.skeletonValue} />
                ) : (
                  <CountUp value={value} />
                )}
              </span>
              <span className={styles.label}>{label}</span>
            </Link>
          </Card>
        ))}
      </div>

      {isIdle && (
        <p className={`${motion.unroll} ${styles.idle}`}>
          Nenhum pedido na fila. Assim que entrar um, ele aparece aqui.
        </p>
      )}
    </section>
  )
}
