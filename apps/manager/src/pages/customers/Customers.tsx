import { Link } from 'react-router'

import { Button, Skeleton } from '@nino/ds'

import { PageTitle } from '@components/PageTitle'
import { PersonMark } from '@components/PersonMark'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useCustomers } from '@hooks/customer/useCustomers'
import { brl } from '@utils/money'
import { formatPhone } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'

import styles from './Customers.module.css'
import motion from '@styles/motion.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: '2-digit',
})

const since = (iso: string): string => day.format(new Date(iso))

export const Customers = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { customers, total, isPending, isError, hasNextPage, fetchNextPage } =
    useCustomers(tenantId)

  return (
    <div className={styles.page}>
      <header className={`${motion.deal} ${styles.header}`}>
        <PageTitle accent="volta">Quem já comprou e volta</PageTitle>
        <p className={styles.subtitle}>
          {total !== undefined
            ? `${total} ${total === 1 ? 'pessoa' : 'pessoas'} com pedido nesta loja.`
            : 'Quem pede pelo app entra nesta lista.'}
        </p>
      </header>

      {isPending && (
        <div className={styles.loading}>
          <Skeleton className={styles.skeletonRow} />
          <Skeleton className={styles.skeletonRow} />
          <Skeleton className={styles.skeletonRow} />
        </div>
      )}

      {isError && (
        <p className={styles.notice}>
          Não foi possível carregar a base agora. Recarregue a página.
        </p>
      )}

      {!isPending && !isError && customers.length === 0 && (
        <p className={`${motion.unroll} ${styles.notice}`}>
          Ninguém por aqui ainda. Quem fizer o primeiro pedido pelo app
          aparece nesta lista.
        </p>
      )}

      {customers.length > 0 && (
        <ul className={styles.list}>
          {customers.map((customer, index) => (
            <li
              key={customer.id}
              className={`${motion.deal} ${styles.item}`}
              style={riseDelay(index * 35 + 60)}
            >
              <Link
                to={customer.id}
                className={`${motion.lift} ${styles.link}`}
              >
                <PersonMark name={customer.name} />

                <div className={styles.who}>
                  <span className={styles.name}>{customer.name}</span>
                  <span className={styles.phone}>
                    {formatPhone(customer.phone)}
                  </span>
                </div>

                <div className={styles.stat}>
                  <span className={styles.statValue}>{customer.orders}</span>
                  <span className={styles.statLabel}>
                    {customer.orders === 1 ? 'pedido' : 'pedidos'}
                  </span>
                </div>

                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {brl(customer.spent)}
                  </span>
                  <span className={styles.statLabel}>gastos</span>
                </div>

                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {customer.loyaltyPoints}
                  </span>
                  <span className={styles.statLabel}>pontos</span>
                </div>

                <span className={styles.since}>
                  desde {since(customer.since)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {hasNextPage && (
        <div className={styles.more}>
          <Button
            variant="outline"
            size="sm"
            className={motion.press}
            onClick={() => void fetchNextPage()}
          >
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  )
}
