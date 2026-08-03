import { Skeleton } from '@nino/ds/components/Skeleton'
import { Breadcrumb } from '@elements/Breadcrumb/Breadcrumb'

import styles from './CustomerDetail.module.css'

/** Quatro fatos e três pedidos: o que a ficha real mostra sem rolar. */
const GHOST_FACTS = ['first', 'second', 'third', 'fourth']
const GHOST_ORDERS = ['first', 'second', 'third']

/**
 * A forma da ficha de cliente enquanto ela não chega: divide o módulo com
 * o CustomerDetail de propósito, para o resumo e o histórico nascerem no
 * lugar exato onde os dados reais vão cair.
 */
export const CustomerDetailSkeleton = () => (
  <div className={styles.page}>
    <Breadcrumb trail={[{ label: 'Clientes', to: '..' }, { label: '—' }]} />

    <p className={styles.eyebrow}>Cliente</p>

    <header className={styles.hero}>
      <Skeleton variant="circle" className={styles.mark} />

      <div className={styles.heroText}>
        <Skeleton className={styles.ghostName} />
        <Skeleton className={styles.ghostPhone} />
      </div>
    </header>

    <div className={styles.body}>
      <dl className={styles.facts}>
        {GHOST_FACTS.map((fact) => (
          <div key={fact} className={styles.fact}>
            <Skeleton className={styles.ghostFactLabel} />
            <Skeleton className={styles.ghostFactValue} />
          </div>
        ))}
      </dl>

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
