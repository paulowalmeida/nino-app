import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import type { Subscription } from '@shared/types/profile/subscription'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './SubscriptionFacts.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const dateOf = (iso: string | null) => (iso ? day.format(new Date(iso)) : '—')

type SubscriptionFactsProps = { subscription: Subscription }

export const SubscriptionFacts = ({ subscription }: SubscriptionFactsProps) => {
  const facts = [
    [
      'Situação',
      <Badge variant={subscription.isActive ? 'success' : 'warning'}>
        {subscription.subscriptionStatus.name}
      </Badge>,
    ],
    ['Assinada em', dateOf(subscription.startedAt)],
    ['Teste até', dateOf(subscription.trialEndsAt)],
    ['Renova em', dateOf(subscription.expiresAt)],
    [
      'Unidades inclusas',
      subscription.plan.maxTenants === null
        ? 'ilimitadas'
        : String(subscription.plan.maxTenants),
    ],
  ] as const

  return (
    <dl className={styles.facts}>
      {facts.map(([label, value], index) => (
        <Box
          key={label}
          direction="row"
          align="baseline"
          gap={3}
          className={`${motion.deal} ${styles.fact}`}
          style={riseDelay(index * 45 + 60)}
        >
          <dt className={styles.factLabel}>{label}</dt>
          <dd className={styles.factValue}>{value}</dd>
        </Box>
      ))}
    </dl>
  )
}
