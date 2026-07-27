import { Link } from 'react-router'

import { Card } from '@nino/ds/components/Card'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { CountUp } from '@components/CountUp'
import { Eyebrow } from '@components/Eyebrow'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { riseDelay } from '@utils/rise-delay'
import type { OrderQueueSummary, OrderStage } from '@custom_types/order'

import type { QueueBoardProps } from './QueueBoard.types'

import styles from './QueueBoard.module.css'
import motion from '@styles/motion.module.css'

const count = (summary: OrderQueueSummary | undefined, ...keys: string[]) =>
  keys.reduce(
    (total, key) => total + (summary?.[key as keyof OrderQueueSummary] ?? 0),
    0
  )

export const QueueBoard = ({ tenantId }: QueueBoardProps) => {
  const { data, isPending } = useQueueSummary(tenantId)

  const waiting = count(data, 'PENDING')

  /** Cada quadro é a mesma etapa que a fila de pedidos filtra. */
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
      label: 'na cozinha',
      value: count(data, 'ACCEPTED', 'PREPARING'),
      stage: 'kitchen',
    },
    {
      label: 'saíram para entrega',
      value: count(data, 'OUT_FOR_DELIVERY'),
      stage: 'street',
    },
    {
      label: 'prontos para retirada',
      value: count(data, 'READY_FOR_PICKUP'),
      stage: 'counter',
    },
  ]

  const idle = !isPending && tiles.every(({ value }) => value === 0)

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
            >
              <span className={styles.value}>
                {isPending ? (
                  <Skeleton
                    animation="wave"
                    className="h-9 w-10 bg-sand lg:h-11"
                  />
                ) : (
                  <CountUp value={value} />
                )}
              </span>
              <span className={styles.label}>{label}</span>
            </Link>
          </Card>
        ))}
      </div>

      {idle && (
        <p className={`${motion.unroll} ${styles.idle}`}>
          Nenhum pedido na fila. Assim que entrar um, ele aparece aqui.
        </p>
      )}
    </section>
  )
}
