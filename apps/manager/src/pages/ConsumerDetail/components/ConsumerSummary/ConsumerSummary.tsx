import { Box } from '@nino/ds/components/Box'
import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
import { brl } from '@shared/utils/money/money'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './ConsumerSummary.module.css'

export const ConsumerSummary = () => {
  const { consumer } = useConsumerDetailFacade()

  if (!consumer) return null

  const facts = [
    ['Gastos', brl(consumer.spent)],
    ['Pedidos', String(consumer.orders)],
    ['Pontos', String(consumer.loyaltyPoints)],
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
