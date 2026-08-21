import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Breadcrumb } from '@atoms/Breadcrumb/Breadcrumb'

import contactStyles from
  '@organisms/CustomerContact/CustomerContact.module.css'
import historyStyles from
  '@organisms/CustomerOrderHistory/CustomerOrderHistory.module.css'
import summaryStyles from
  '@organisms/CustomerSummary/CustomerSummary.module.css'
import styles from '@pages/customer-detail/CustomerDetail.module.css'

const GHOST_FACTS = ['spent', 'orders', 'points']
const GHOST_CONTACT_ACTIONS = ['phone', 'email']
const GHOST_TABS = ['orders', 'addresses']
const GHOST_ORDERS = ['first', 'second', 'third', 'fourth', 'fifth']

export const CustomerDetailSkeleton = () => (
  <div className={styles.page}>
    <Breadcrumb trail={[{ label: 'Clientes', to: '..' }, { label: '—' }]} />

    <Box
      as="header"
      direction="row"
      gap={4}
      align="center"
      className={styles.hero}
    >
      <Skeleton variant="circle" className={styles.mark} />

      <div className={styles.heroText}>
        <Skeleton className={styles.ghostEyebrow} />
        <Skeleton className={styles.ghostName} />
        <Skeleton className={styles.ghostCadence} />
      </div>
    </Box>

    <section aria-label="Resumo" className={summaryStyles.strip}>
      <dl className={summaryStyles.facts}>
        {GHOST_FACTS.map((fact) => (
          <div key={fact} className={summaryStyles.fact}>
            <Skeleton className={styles.ghostFactLabel} />
            <Skeleton className={styles.ghostStripValue} />
          </div>
        ))}
      </dl>
    </section>

    <div className={contactStyles.contact}>
      <div className={contactStyles.actions}>
        {GHOST_CONTACT_ACTIONS.map((action) => (
          <Skeleton key={action} className={styles.ghostContactAction} />
        ))}
      </div>
    </div>

    <div className={styles.panels}>
      <Box direction="row" gap={2}>
        {GHOST_TABS.map((tab) => (
          <Skeleton key={tab} className={styles.ghostTab} />
        ))}
      </Box>

      <ul>
        {GHOST_ORDERS.map((order) => (
          <li key={order} className={historyStyles.order}>
            <div className={styles.ghostOrderLink}>
              <Skeleton className={styles.ghostOrderNumber} />
              <Skeleton className={styles.ghostOrderStatus} />
              <Skeleton className={styles.ghostOrderTotal} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)
