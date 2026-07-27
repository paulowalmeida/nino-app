import { Link, useParams, useSearchParams } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus'
import { STATUS_LABEL } from '@utils/order-flow'

import styles from './OrderTracking.module.css'

const stamp = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

/** A previsão é a hora, não a data: ninguém espera o pedido pra outro dia. */
const clock = new Intl.DateTimeFormat('pt-BR', {
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
      <EmptyState
        size="md"
        className={styles.notFound}
        illustration={<img src="/mascot-consumer-sad.svg" alt="" />}
        title="Pedido não encontrado"
        action={
          <Link to={backHref} className={styles.backLink}>
            Voltar para a loja
          </Link>
        }
      >
        Confira o link — ele é o mesmo que apareceu na hora do pedido.
      </EmptyState>
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
        <div className={styles.statusText}>
          <p className={styles.statusLabel}>{STATUS_LABEL[order.status]}</p>
          {order.estimatedDeliveryAt && !isCancelled && (
            <p className={styles.statusEta}>
              Previsão {clock.format(new Date(order.estimatedDeliveryAt))}
            </p>
          )}
        </div>
      </div>

      <ol className={styles.timeline}>
        {order.timeline.map((entry, index) => {
          const isCurrent = index === order.timeline.length - 1
          return (
            <li
              key={`${entry.status}-${entry.at}`}
              className={
                isCurrent ? `${styles.entry} ${styles.current}` : styles.entry
              }
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className={styles.entryDot} aria-hidden="true">
                {!isCurrent && (
                  <svg width="8" height="8" viewBox="0 0 12 12">
                    <path
                      d="M2.5 6.5l2.5 2.5 4.5-5.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                )}
              </span>
              <div>
                <p className={styles.entryLabel}>{STATUS_LABEL[entry.status]}</p>
                <p className={styles.entryTime}>
                  {stamp.format(new Date(entry.at))}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <p className={styles.code}>Código do pedido: {order.id.slice(0, 8)}</p>
    </div>
  )
}
