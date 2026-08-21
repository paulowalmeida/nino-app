import { Card } from '@nino/ds/components/Card'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { ACCOUNT_SUBSCRIPTION_GHOST_FACTS } from '@constants/account.constants'

import styles from './SubscriptionSkeleton.module.css'

export const SubscriptionSkeleton = () => (
  <>
    <p role="status" aria-label="Carregando assinatura" className="sr-only">
      Carregando assinatura
    </p>

    <Card>
      <Flexbox
        wrap
        align="end"
        justify="between"
        gap={3}
        className={styles.plan}
      >
        <Flexbox>
          <Skeleton variant="text" className={styles.ghostPlanLabel} />
          <Skeleton variant="text" className={styles.ghostPlanName} />
        </Flexbox>
        <Skeleton variant="text" className={styles.ghostPrice} />
      </Flexbox>

      <dl className={styles.facts}>
        {ACCOUNT_SUBSCRIPTION_GHOST_FACTS.map((fact) => (
          <Flexbox
            key={fact}
            align="baseline"
            justify="between"
            gap={3}
            className={styles.fact}
          >
            <Skeleton variant="text" className={styles.ghostFactLabel} />
            <Skeleton variant="text" className={styles.ghostFactValue} />
          </Flexbox>
        ))}
      </dl>
    </Card>
  </>
)
