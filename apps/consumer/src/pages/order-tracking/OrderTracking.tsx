import { Link, useParams, useSearchParams } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { OrderJourney } from '@compositions/OrderJourney/OrderJourney'
import { OrderStage } from '@compositions/OrderStage/OrderStage'
import { PoweredBy } from '@elements/PoweredBy/PoweredBy'
import { useCustomerSession } from '@hooks/useCustomerSession'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus'
import { useScrollProgress } from '@hooks/useScrollProgress'
import { isTerminal } from '@utils/order-journey'
import { riseDelay } from '@utils/rise-delay'

import styles from './OrderTracking.module.css'
import motion from '@styles/motion.module.css'

export const OrderTracking = () => {
  const { slug: pathSlug, orderId } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? undefined
  const backHref = pathSlug ? `/${pathSlug}` : '/'

  const { customer, isPending: loadingSession } = useCustomerSession()
  const progress = useScrollProgress(60)

  const {
    data: order,
    isPending,
    isError,
  } = useGuestOrderStatus(orderId, token, !!customer)

  /* Sem token e sem sessão não há como provar de quem é o pedido: a consulta
     nem sai, então esperar por ela seria um esqueleto eterno. */
  const canAsk = !!token || !!customer

  if (!loadingSession && !canAsk) {
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
        Abra pelo link que apareceu na hora do pedido, ou entre na sua conta
        para ver seus pedidos.
      </EmptyState>
    )
  }

  if (isPending || loadingSession) {
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
        <div className={styles.skStage} />
        <div className={styles.skJourney}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skRow}>
              <div className={styles.skDot} />
              <div className={styles.skLabel} />
              <div className={styles.skTime} />
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

  const done = isTerminal(order.status)

  return (
    <div
      className={styles.page}
      style={{ '--p': progress } as React.CSSProperties}
    >
      <div className={styles.shell}>
        <header className={`${motion.settle} ${styles.header}`}>
          <Link
            to={backHref}
            className={`${motion.press} ${styles.back}`}
            aria-label="Voltar para a loja"
          >
            ←
          </Link>
          <div>
            <h1 className={styles.title}>Seu pedido</h1>
            <p className={styles.code}>#{order.id.slice(0, 8)}</p>
          </div>
        </header>

        <OrderStage
          order={order}
          className={motion.riseIn}
          style={riseDelay(60)}
        />

        {!done && (
          <p
            className={`${motion.riseIn} ${styles.reassurance}`}
            style={riseDelay(120)}
          >
            <span className={styles.whatsappDot} aria-hidden="true" />
            Pode fechar esta tela. A gente avisa no WhatsApp a cada passo.
          </p>
        )}

        <p
          className={`${motion.riseIn} ${styles.eyebrow}`}
          style={riseDelay(160)}
        >
          Passo a passo
        </p>

        <OrderJourney order={order} />

        {done && (
          <Link
            to={backHref}
            className={[
              motion.press,
              motion.riseIn,
              order.status === 'CANCELLED' ? styles.againQuiet : styles.again,
            ].join(' ')}
            style={riseDelay(420)}
          >
            {order.status === 'CANCELLED'
              ? 'Voltar ao cardápio'
              : 'Pedir de novo'}
          </Link>
        )}
      </div>

      <PoweredBy />
    </div>
  )
}
