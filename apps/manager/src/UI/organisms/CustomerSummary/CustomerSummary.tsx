import type { CustomerHistory } from '@custom_types/customer/customer-history'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import styles from './CustomerSummary.module.css'
import motion from '@styles/motion.module.css'

type CustomerSummaryProps = {
  customer: CustomerHistory
}

export const CustomerSummary = ({ customer }: CustomerSummaryProps) => (
  <section aria-label="Resumo" className={styles.strip}>
    <dl className={styles.facts}>
      {[
        ['Gastos', brl(customer.spent)],
        ['Pedidos', String(customer.orders)],
        ['Pontos', String(customer.loyaltyPoints)],
      ].map(([label, value], index) => (
        <div
          key={label}
          className={`${motion.settle} ${styles.fact}`}
          style={riseDelay(index * 60 + 120)}
        >
          <dt className={styles.factLabel}>{label}</dt>
          <dd className={styles.factValue}>{value}</dd>
        </div>
      ))}
    </dl>
  </section>
)
