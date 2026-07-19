import { CountUp } from '@components/CountUp'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import type { OrderQueueSummary } from '@custom_types/order'

import type { QueueBoardProps } from './QueueBoard.types'

import styles from './QueueBoard.module.css'

const count = (summary: OrderQueueSummary | undefined, ...keys: string[]) =>
  keys.reduce(
    (total, key) => total + (summary?.[key as keyof OrderQueueSummary] ?? 0),
    0
  )

export const QueueBoard = ({ tenantId }: QueueBoardProps) => {
  const { data, isPending } = useQueueSummary(tenantId)

  const waiting = count(data, 'PENDING')
  const tiles = [
    { label: 'esperando aceite', value: waiting, urgent: waiting > 0 },
    { label: 'na cozinha', value: count(data, 'ACCEPTED', 'PREPARING') },
    { label: 'saíram para entrega', value: count(data, 'OUT_FOR_DELIVERY') },
    { label: 'prontos para retirada', value: count(data, 'READY_FOR_PICKUP') },
  ]

  const idle = !isPending && tiles.every(({ value }) => value === 0)

  return (
    <section aria-label="Fila de pedidos">
      <h2 className={styles.heading}>Agora na loja</h2>

      <div className={styles.board}>
        {tiles.map(({ label, value, urgent }) => (
          <article
            key={label}
            className={urgent ? `${styles.tile} ${styles.urgent}` : styles.tile}
          >
            <span className={styles.value}>
              {isPending ? '·' : <CountUp value={value} />}
            </span>
            <span className={styles.label}>{label}</span>
          </article>
        ))}
      </div>

      {idle && (
        <p className={styles.idle}>
          Nenhum pedido na fila. Assim que entrar um, ele aparece aqui.
        </p>
      )}
    </section>
  )
}
