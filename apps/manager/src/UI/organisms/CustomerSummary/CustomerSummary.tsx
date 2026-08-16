import type { CustomerHistory } from '@custom_types/customer/customer-history'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import styles from './CustomerSummary.module.css'
import motion from '@styles/motion.module.css'

type CustomerSummaryProps = {
  customer: CustomerHistory
}

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export const CustomerSummary = ({ customer }: CustomerSummaryProps) => (
  <section aria-label="Resumo">
    <p className={styles.eyebrow}>Resumo</p>

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
  </section>
)
