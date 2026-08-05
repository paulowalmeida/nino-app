import { Link, useParams } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { useCustomerSession } from '@hooks/useCustomerSession'
import { useMyOrders } from '@hooks/useMyOrders'
import { clockLabel } from '@utils/clock'
import { brl } from '@utils/money'
import { STATUS_LABEL } from '@constants/order.constants'
import { isTerminal, stageIcon } from '@utils/order-journey'
import { riseDelay } from '@utils/rise-delay'

import styles from './Orders.module.css'
import section from '../section.module.css'
import motion from '@styles/motion.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

/**
 * O que já saiu desta cozinha para você. Cada linha abre a mesma tela de
 * acompanhamento do pedido em andamento — inclusive a dos já entregues, que
 * é onde mora a comanda inteira com valores e pagamento.
 */
export const Orders = () => {
  const { slug } = useParams()
  const { customer } = useCustomerSession()
  const { data: orders, isPending } = useMyOrders(!!customer)

  const orderPath = (id: string) =>
    slug ? `/${slug}/pedido/${id}` : `/pedido/${id}`

  return (
    <div>
      <p className={section.eyebrow}>Pedidos</p>
      <h2 className={section.headline}>Tudo que você já pediu aqui</h2>
      <p className={section.note}>
        Toque em um pedido para ver a comanda, os valores e como foi o
        pagamento.
      </p>

      {isPending && (
        <>
          <div className={section.skRow} />
          <div className={section.skRow} />
          <div className={section.skRow} />
        </>
      )}

      {!isPending && orders?.length === 0 && (
        <EmptyState size="md" className={styles.empty}>
          Seus pedidos aparecem aqui assim que você fizer o primeiro.
        </EmptyState>
      )}

      <ul className={styles.list}>
        {orders?.map((order, index) => (
          <li
            key={order.id}
            className={`${motion.deal} ${styles.item}`}
            style={riseDelay(index * 55)}
          >
            <Link to={orderPath(order.id)} className={styles.link}>
              <span className={styles.stage} aria-hidden="true">
                {stageIcon(order.status)}
              </span>

              <span className={styles.body}>
                <span className={styles.status}>
                  {STATUS_LABEL[order.status]}
                  {!isTerminal(order.status) && (
                    <span className={styles.live}>em andamento</span>
                  )}
                </span>
                <span className={styles.when}>
                  {day.format(new Date(order.createdAt))} ·{' '}
                  {clockLabel(order.createdAt)}
                </span>
              </span>

              <span className={styles.total}>
                {brl(Number(order.totalAmount))}
              </span>

              <Icon name="chevron-right" className={styles.chevron} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
