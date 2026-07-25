import { Link, useParams, useSearchParams } from 'react-router'

import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus'
import { STATUS_LABEL } from '@utils/order-flow'

import styles from './OrderTracking.module.css'

const stamp = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export const OrderTracking = () => {
  const { slug: pathSlug, orderId } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? undefined
  const backHref = pathSlug ? `/${pathSlug}` : '/'

  const {
    data: order,
    isPending,
    isError,
  } = useGuestOrderStatus(orderId, token)

  if (isPending) {
    return (
      <div
        className={styles.page}
        aria-busy="true"
        aria-label="Carregando o pedido"
      >
        <header className={styles.header}>
          <div className={styles.skBack} />
          <div className={styles.skTitle} />
        </header>
        <div className={styles.skStatus} />
        <div className={styles.skEta} />
        <div className={styles.skTimeline}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skEntry}>
              <div className={styles.skDot} />
              <div className={styles.skEntryText}>
                <div className={styles.skEntryLabel} />
                <div className={styles.skEntryTime} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className={styles.notFound}>
        <img
          src="/mascot-consumer-sad.svg"
          alt=""
          className={styles.notFoundMascot}
        />
        <h1 className={styles.notFoundTitle}>Pedido não encontrado</h1>
        <p className={styles.notFoundText}>
          Confira o link — ele é o mesmo que apareceu na hora do pedido.
        </p>
        <Link to={backHref} className={styles.backLink}>
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const isCancelled = order.status === 'CANCELLED'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to={backHref} className={styles.back} aria-label="Voltar">
          ←
        </Link>
        <h1 className={styles.title}>Seu pedido</h1>
      </header>

      <div
        className={
          isCancelled
            ? `${styles.status} ${styles.statusCancelled}`
            : styles.status
        }
      >
        <span className={styles.statusDot} aria-hidden="true" />
        <p className={styles.statusLabel}>{STATUS_LABEL[order.status]}</p>
      </div>

      {order.estimatedDeliveryAt && !isCancelled && (
        <p className={styles.eta}>
          Previsão: {stamp.format(new Date(order.estimatedDeliveryAt))}
        </p>
      )}

      <ol className={styles.timeline}>
        {order.timeline.map((entry, index) => (
          <li key={`${entry.status}-${entry.at}`} className={styles.entry}>
            <span
              className={
                index === order.timeline.length - 1
                  ? `${styles.entryDot} ${styles.entryDotCurrent}`
                  : styles.entryDot
              }
              aria-hidden="true"
            />
            <div>
              <p className={styles.entryLabel}>{STATUS_LABEL[entry.status]}</p>
              <p className={styles.entryTime}>
                {stamp.format(new Date(entry.at))}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className={styles.code}>Código do pedido: {order.id.slice(0, 8)}</p>
    </div>
  )
}
