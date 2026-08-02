import { Link, useParams } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Breadcrumb } from '@components/Breadcrumb'
import { PersonMark } from '@components/PersonMark'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useCustomer } from '@hooks/customer/useCustomers'
import { brl } from '@utils/money'
import { formatPhone } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'
import { STATUS_LABEL, ticketNumber } from '@utils/order-flow'

import styles from './CustomerDetail.module.css'
import motion from '@styles/motion.module.css'

const stamp = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

export const CustomerDetail = () => {
  const { customerId } = useParams()
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { data: customer, isPending } = useCustomer(
    tenantId,
    customerId as string
  )

  if (isPending) return <Skeleton className={styles.skeleton} />

  if (!customer) {
    return (
      <div className={styles.page}>
        <Breadcrumb trail={[{ label: 'Clientes', to: '..' }, { label: '—' }]} />
        <EmptyState>
          Esta pessoa não tem pedido nesta loja.
        </EmptyState>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Breadcrumb
        trail={[
          { label: 'Clientes', to: '..' },
          { label: customer.name },
        ]}
      />

      <header className={`${motion.settle} ${styles.hero}`}>
        <PersonMark name={customer.name} className={styles.mark} />
        <div className={styles.heroText}>
          <h1 className={styles.name}>{customer.name}</h1>
          <a href={`tel:${customer.phone}`} className={styles.phone}>
            {formatPhone(customer.phone)}
          </a>
          {customer.email && (
            <p className={styles.email}>{customer.email}</p>
          )}
        </div>
      </header>

      <dl className={styles.facts}>
        {[
          ['Pedidos', String(customer.orders)],
          ['Gastos', brl(customer.spent)],
          ['Pontos', String(customer.loyaltyPoints)],
          ['Cliente desde', day.format(new Date(customer.since))],
        ].map(([label, value], index) => (
          <div
            key={label}
            className={`${motion.settle} ${styles.fact}`}
            style={riseDelay(index * 50 + 60)}
          >
            <dt className={styles.factLabel}>{label}</dt>
            <dd className={styles.factValue}>{value}</dd>
          </div>
        ))}
      </dl>

      <section className={styles.history} aria-label="Últimos pedidos">
        <div className={styles.historyHead}>
          <h2 className={styles.historyTitle}>Últimos pedidos</h2>
          <p className={styles.historyWindow}>
            90 dias ou 90 pedidos — o que vier primeiro
          </p>
        </div>

        {customer.history.length === 0 ? (
          <EmptyState>
            Nenhum pedido registrado nesta loja ainda.
          </EmptyState>
        ) : (
          <ScrollArea className={styles.ordersScroll}>
            <ul className={styles.orders}>
            {customer.history.map((order, index) => (
              <li
                key={order.id}
                className={`${motion.deal} ${styles.order}`}
                style={riseDelay(index * 40 + 80)}
              >
                <Link
                  to={`../../pedidos/${order.id}`}
                  relative="path"
                  className={`${motion.lift} ${styles.orderLink}`}
                >
                  <span className={styles.orderNumber}>
                    #{ticketNumber(order.id)}
                  </span>
                  <span className={styles.orderStatus}>
                    {STATUS_LABEL[order.status]}
                  </span>
                  <time className={styles.orderAt} dateTime={order.createdAt}>
                    {stamp.format(new Date(order.createdAt))}
                  </time>
                  <span className={styles.orderTotal}>
                    {brl(order.totalAmount)}
                  </span>
                </Link>
              </li>
            ))}
            </ul>
          </ScrollArea>
        )}
      </section>
    </div>
  )
}
