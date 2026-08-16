import { Flexbox } from '@nino/ds/components/Flexbox'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Breadcrumb } from '@elements/Breadcrumb/Breadcrumb'

import styles from '@pages/customer-detail/CustomerDetail.module.css'

const GHOST_PERSONAL_DATA = ['phone', 'email', 'cpf']
const GHOST_FACTS = ['first', 'second', 'third', 'fourth']
const GHOST_ORDERS = ['first', 'second', 'third']

export const CustomerDetailSkeleton = () => (
  <div className={styles.page}>
    <Breadcrumb trail={[{ label: 'Clientes', to: '..' }, { label: '—' }]} />

    <p className={styles.eyebrow}>Cliente</p>

    <Flexbox as="header" direction="row" gap={4} align="center" mt={1}>
      <Skeleton variant="circle" className={styles.mark} />

      <div className={styles.heroText}>
        <Skeleton className={styles.ghostName} />
      </div>
    </Flexbox>

    <div className={styles.body}>
      <div className={styles.summary}>
        <section aria-label="Dados pessoais">
          <Skeleton className={styles.ghostEyebrow} />

          <div className={styles.facts}>
            {GHOST_PERSONAL_DATA.map((fact) => (
              <div key={fact} className={styles.fact}>
                <Skeleton className={styles.ghostFactLabel} />
                <Skeleton className={styles.ghostFactValue} />
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Resumo">
          <Skeleton className={styles.ghostEyebrow} />

          <dl className={styles.facts}>
            {GHOST_FACTS.map((fact) => (
              <div key={fact} className={styles.fact}>
                <Skeleton className={styles.ghostFactLabel} />
                <Skeleton className={styles.ghostFactValue} />
              </div>
            ))}
          </dl>
        </section>

        <section aria-label="Endereços registrados">
          <Skeleton className={styles.ghostEyebrow} />
          <Skeleton className={styles.ghostAddress} />
        </section>
      </div>

      <section className={styles.history} aria-label="Últimos pedidos">
        <div className={styles.historyHead}>
          <Skeleton className={styles.ghostHistoryTitle} />
          <Skeleton className={styles.ghostHistoryWindow} />
        </div>

        <ul className={styles.orders}>
          {GHOST_ORDERS.map((order) => (
            <li key={order} className={styles.order}>
              <div className={styles.ghostOrderLink}>
                <Skeleton className={styles.ghostOrderNumber} />
                <Skeleton className={styles.ghostOrderStatus} />
                <Skeleton className={styles.ghostOrderTotal} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </div>
)
