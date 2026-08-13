import { Flexbox } from '@nino/ds/components/Flexbox'
import { Link } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { PersonMark } from '@components/PersonMark/PersonMark'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useCustomers } from '@hooks/customer/useCustomers'
import {
  CUSTOMERS_COLUMNS,
  CUSTOMERS_GHOST_ROWS,
} from '@constants/customer.constants'
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
      <p className={styles.eyebrow}>Clientes</p>

      <header className={`${motion.deal} ${styles.head}`}>
        <h1 className={styles.title}>Quem já comprou e volta</h1>
        <p className={styles.subtitle}>
          {total !== undefined
            ? `${total} ${total === 1 ? 'pessoa' : 'pessoas'} com pedido nesta loja. Abra alguém para ver o histórico.`
            : 'Quem pede pelo app entra nesta lista.'}
        </p>
      </header>

      {isPending && (
        <Flexbox direction="column" gap={2} mt={6}>
          {CUSTOMERS_GHOST_ROWS.map((row) => (
            <div key={row} className={`${styles.grid} ${styles.ghostRow}`}>
              <span className={styles.who}>
                <Skeleton variant="circle" className={styles.ghostMark} />
                <span className={styles.identity}>
                  <Skeleton className={styles.ghostName} />
                  <Skeleton className={styles.ghostPhone} />
                </span>
              </span>

              <span className={styles.stats}>
                <Skeleton className={styles.ghostStat} />
                <Skeleton className={styles.ghostStat} />
                <Skeleton className={styles.ghostStatDesktop} />
                <Skeleton className={styles.ghostStatDesktop} />
              </span>
            </div>
          ))}
        </Flexbox>
      )}

      {isError && (
        <Alert variant="error">
          Não foi possível carregar a base agora. Recarregue a página.
        </Alert>
      )}

      {!isPending && !isError && customers.length === 0 && (
        <EmptyState className={`${motion.unroll} ${styles.empty}`}>
          Ninguém por aqui ainda. Quem fizer o primeiro pedido pelo app aparece
          nesta lista.
        </EmptyState>
      )}

      {customers.length > 0 && (
        <>
          <div className={`${styles.grid} ${styles.columns}`} aria-hidden>
            {CUSTOMERS_COLUMNS.map((label) => (
              <span key={label} className={styles.columnLabel}>
                {label}
              </span>
            ))}
          </div>

          <ScrollArea className={styles.listScroll}>
            <ul className={styles.list}>
              {customers.map((customer, index) => (
                <li
                  key={customer.id}
                  className={`${motion.deal} ${styles.item}`}
                  style={riseDelay(index * 35 + 60)}
                >
                  <Link
                    to={customer.id}
                    className={`${styles.grid} ${styles.link}`}
                  >
                    <span className={styles.who}>
                      <PersonMark name={customer.name} />

                      <span className={styles.identity}>
                        <span className={styles.name}>{customer.name}</span>
                        <span className={styles.phone}>
                          {formatPhone(customer.phone)}
                        </span>
                      </span>
                    </span>

                    <span className={styles.stats}>
                      {/* no celular o dinheiro lidera; no desktop vira coluna */}
                      <span className={styles.stat}>
                        <span className={styles.statValue}>
                          {brl(customer.spent)}
                        </span>
                      </span>

                      <span className={styles.stat}>
                        <span className={styles.statOrders}>
                          {customer.orders}
                        </span>
                        <span className={styles.statLabel}>
                          {customer.orders === 1 ? ' pedido' : ' pedidos'}
                        </span>
                      </span>

                      <span className={styles.statPoints}>
                        <span className={styles.statValue}>
                          {customer.loyaltyPoints}
                        </span>
                      </span>

                      <span className={styles.since}>
                        {since(customer.since)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </>
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
