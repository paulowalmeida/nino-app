import { Box } from '@nino/ds/components/Box'
import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
import { brl } from '@shared/utils/money/money'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './CustomerSummary.module.css'

export const CustomerSummary = () => {
  const { customer } = useCustomerDetailFacade()

  if (!customer) return null

  const facts = [
    ['Gastos', brl(customer.spent)],
    ['Pedidos', String(customer.orders)],
    ['Pontos', String(customer.loyaltyPoints)],
  ]

  return (
    <section aria-label="Resumo" className={styles.strip}>
      <dl className={styles.facts}>
        {facts.map(([label, value], index) => (
          <Box
            key={label}
            className={`${motion.settle} ${styles.fact}`}
            style={riseDelay(index * 60 + 120)}
          >
            <dt className={styles.factLabel}>{label}</dt>
            <dd className={styles.factValue}>{value}</dd>
          </Box>
        ))}
      </dl>
    </section>
  )
}
