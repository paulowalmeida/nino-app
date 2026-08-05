import type { ReactNode } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Badge } from '@nino/ds/components/Badge'
import { Card } from '@nino/ds/components/Card'
import { PageHeader } from '@nino/ds/components/PageHeader'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { useSubscription } from '@hooks/account/useSubscription'
import { ACCOUNT_SUBSCRIPTION_GHOST_FACTS } from '@constants/account.constants'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import styles from './AccountSubscription.module.css'
import motion from '@styles/motion.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const dateOf = (iso: string | null): string =>
  iso ? day.format(new Date(iso)) : '—'

export const AccountSubscription = () => {
  const { data, isPending, isError } = useSubscription()

  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.header}
        title="Assinatura e plano"
        accent="plano"
        description="A assinatura é da empresa e vale para todas as unidades."
      />

      {isPending && (
        <Card>
          <div className={styles.plan}>
            <div>
              <Skeleton variant="text" className={styles.ghostPlanLabel} />
              <Skeleton variant="text" className={styles.ghostPlanName} />
            </div>
            <Skeleton variant="text" className={styles.ghostPrice} />
          </div>

          <dl className={styles.facts}>
            {ACCOUNT_SUBSCRIPTION_GHOST_FACTS.map((fact) => (
              <div key={fact} className={styles.fact}>
                <Skeleton variant="text" className={styles.ghostFactLabel} />
                <Skeleton variant="text" className={styles.ghostFactValue} />
              </div>
            ))}
          </dl>
        </Card>
      )}

      {isError && (
        <Alert variant="error">
          Não foi possível carregar a assinatura agora.
        </Alert>
      )}

      {data && (
        <Card className={motion.settle}>
          <div className={styles.plan}>
            <div>
              <p className={styles.planLabel}>Plano atual</p>
              <p className={styles.planName}>{data.plan.name}</p>
            </div>
            <p className={styles.price}>
              {brl(data.plan.price)}
              <span className={styles.period}>/mês</span>
            </p>
          </div>

          <dl className={styles.facts}>
            {(
              [
                [
                  'Situação',
                  <Badge variant={data.isActive ? 'success' : 'warning'}>
                    {data.subscriptionStatus.name}
                  </Badge>,
                ],
                ['Assinada em', dateOf(data.startedAt)],
                ['Teste até', dateOf(data.trialEndsAt)],
                ['Renova em', dateOf(data.expiresAt)],
                [
                  'Unidades inclusas',
                  data.plan.maxTenants === null
                    ? 'ilimitadas'
                    : String(data.plan.maxTenants),
                ],
              ] satisfies [string, ReactNode][]
            ).map(([label, value], index) => (
              <div
                key={label}
                className={`${motion.deal} ${styles.fact}`}
                style={riseDelay(index * 45 + 60)}
              >
                <dt className={styles.factLabel}>{label}</dt>
                <dd className={styles.factValue}>{value}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.hint}>
            Mudança de plano e cancelamento passam pelo suporte enquanto a troca
            automática não está no ar.
          </p>
        </Card>
      )}
    </div>
  )
}
