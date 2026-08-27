import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import styles from './CustomerDetailSkeleton.module.css'

const GHOST_FACTS = ['spent', 'orders', 'points']
const GHOST_CONTACT_ACTIONS = ['phone', 'email']
const GHOST_TABS = ['orders', 'addresses']
const GHOST_ORDERS = ['first', 'second', 'third', 'fourth', 'fifth']

export const CustomerDetailSkeleton = () => (
  <div className={styles.page}>
    <Breadcrumb trail={[{ label: 'Clientes', to: '..' }, { label: '—' }]} />

    <p role="status" className="sr-only">
      Carregando cliente
    </p>

    <Box
      as="header"
      direction="row"
      gap={4}
      align="center"
      className={styles.hero}
    >
      <Skeleton variant="circle" className={styles.mark} />

      <div className={styles.heroText}>
        <Skeleton className={styles.eyebrow} />
        <Skeleton className={styles.name} />
        <Skeleton className={styles.cadence} />
      </div>
    </Box>

    <section aria-label="Resumo" className={styles.strip}>
      <dl className={styles.facts}>
        {GHOST_FACTS.map((fact) => (
          <div key={fact} className={styles.fact}>
            <Skeleton className={styles.factLabel} />
            <Skeleton className={styles.factValue} />
          </div>
        ))}
      </dl>
    </section>

    <div className={styles.contact}>
      <div className={styles.actions}>
        {GHOST_CONTACT_ACTIONS.map((action) => (
          <Skeleton key={action} className={styles.action} />
        ))}
      </div>
    </div>

    <div className={styles.panels}>
      <Box direction="row" gap={2}>
        {GHOST_TABS.map((tab) => (
          <Skeleton key={tab} className={styles.tab} />
        ))}
      </Box>

      <ul className={styles.orders}>
        {GHOST_ORDERS.map((order) => (
          <li key={order} className={styles.order}>
            <div className={styles.orderRow}>
              <Skeleton className={styles.orderNumber} />
              <Skeleton className={styles.orderStatus} />
              <Skeleton className={styles.orderTotal} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)
