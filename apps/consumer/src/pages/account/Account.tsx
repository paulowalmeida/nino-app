import { Link, Navigate, useParams } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { useCustomerSession } from '@hooks/useCustomerSession'
import { useLogout } from '@hooks/useLogout'
import { useMyOrders } from '@hooks/useMyOrders'
import { clockLabel } from '@utils/clock'
import { brl } from '@utils/money'
import { STATUS_LABEL } from '@utils/order-flow'
import { isTerminal, stageIcon } from '@utils/order-journey'
import { formatPhone } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'

import styles from './Account.module.css'
import motion from '@styles/motion.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})

/**
 * A área de quem tem conta. O que ela entrega e a compra sem conta não: saber
 * o que já foi pedido aqui, e voltar a acompanhar um pedido em andamento sem
 * depender do link que chegou no WhatsApp.
 */
export const Account = () => {
  const { slug } = useParams()
  const home = slug ? `/${slug}` : '/'
  const signIn = slug ? `/${slug}/entrar` : '/entrar'

  const { customer, isPending } = useCustomerSession()
  const { data: orders, isPending: loadingOrders } = useMyOrders(!!customer)
  const logout = useLogout()

  if (isPending) {
    return (
      <div className={styles.page} aria-busy="true" aria-label="Carregando">
        <div className={styles.skCard} />
      </div>
    )
  }

  if (!customer) return <Navigate to={signIn} replace />

  const named = customer.profileCompletedAt ? customer.name : 'Bem-vindo'

  return (
    <div className={styles.page}>
      <header className={`${motion.riseIn} ${styles.header}`}>
        <Link
          to={home}
          className={`${motion.press} ${styles.back}`}
          aria-label="Voltar para a loja"
        >
          ←
        </Link>
        <h1 className={styles.title}>Sua conta</h1>
      </header>

      <section
        className={`${motion.riseIn} ${styles.card}`}
        style={riseDelay(60)}
      >
        <p className={styles.eyebrow}>Você está logado</p>
        <h2 className={styles.name}>{named}</h2>
        <p className={styles.phone}>{formatPhone(customer.phone)}</p>
      </section>

      <p
        className={`${motion.riseIn} ${styles.sectionLabel}`}
        style={riseDelay(120)}
      >
        Seus pedidos
      </p>

      {loadingOrders && <div className={styles.skList} />}

      {!loadingOrders && orders?.length === 0 && (
        <EmptyState size="md" className={styles.empty}>
          Seus pedidos aparecem aqui assim que você fizer o primeiro.
        </EmptyState>
      )}

      <ul className={styles.orders}>
        {orders?.map((order, index) => (
          <li
            key={order.id}
            className={`${motion.riseIn} ${styles.order}`}
            style={riseDelay(160 + index * 55)}
          >
            <Link
              to={slug ? `/${slug}/pedido/${order.id}` : `/pedido/${order.id}`}
              className={styles.orderLink}
            >
              <span className={styles.orderIcon} aria-hidden="true">
                {stageIcon(order.status)}
              </span>

              <span className={styles.orderBody}>
                <span className={styles.orderStatus}>
                  {STATUS_LABEL[order.status]}
                </span>
                <span className={styles.orderWhen}>
                  {day.format(new Date(order.createdAt))} ·{' '}
                  {clockLabel(order.createdAt)}
                  {!isTerminal(order.status) && (
                    <span className={styles.live}> · em andamento</span>
                  )}
                </span>
              </span>

              <span className={styles.orderTotal}>
                {brl(Number(order.totalAmount))}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Button
        variant="outline"
        className={`${motion.press} ${styles.logout}`}
        disabled={logout.isPending}
        onClick={() => logout.mutate()}
      >
        Sair da conta
      </Button>
    </div>
  )
}
