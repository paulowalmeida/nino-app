import type { ReactNode } from 'react'

import { Badge } from '@nino/ds/components/Badge'
import { Card } from '@nino/ds/components/Card'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Text } from '@nino/ds/components/Text'
import type { Subscription } from '@custom_types/account/subscription'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import styles from './SubscriptionCard.module.css'
import motion from '@styles/motion.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const dateOf = (iso: string | null): string =>
  iso ? day.format(new Date(iso)) : '—'

type SubscriptionCardProps = { subscription: Subscription }

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => (
  <Card className={motion.settle}>
    <Flexbox
      wrap
      align="end"
      justify="between"
      gap={3}
      className={styles.plan}
    >
      <Flexbox>
        <Text as="p" size="xs" weight="bold" case="uppercase" color="faint">
          Plano atual
        </Text>
        <Text
          as="p"
          size="2xl"
          weight="extrabold"
          font="display"
          color="strong"
          className={styles.planName}
        >
          {subscription.plan.name}
        </Text>
      </Flexbox>
      <Text
        as="p"
        size="xl"
        weight="extrabold"
        font="display"
        color="brand-strong"
        className={styles.price}
      >
        {brl(subscription.plan.price)}
        <Text as="span" size="sm" weight="semibold" color="faint">
          /mês
        </Text>
      </Text>
    </Flexbox>

    <dl className={styles.facts}>
      {(
        [
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
        ] satisfies [string, ReactNode][]
      ).map(([label, value], index) => (
        <Flexbox
          key={label}
          align="baseline"
          justify="between"
          gap={3}
          className={`${motion.deal} ${styles.fact}`}
          style={riseDelay(index * 45 + 60)}
        >
          <dt className={styles.factLabel}>{label}</dt>
          <dd className={styles.factValue}>{value}</dd>
        </Flexbox>
      ))}
    </dl>

    <Text as="p" size="xs" color="faint" mt={4} className={styles.hint}>
      Mudança de plano e cancelamento passam pelo suporte enquanto a
      troca automática não está no ar.
    </Text>
  </Card>
)
