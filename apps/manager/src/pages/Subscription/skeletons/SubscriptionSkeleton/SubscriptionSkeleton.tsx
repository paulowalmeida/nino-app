import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Skeleton } from '@nino/ds/components/Skeleton'

import styles from './SubscriptionSkeleton.module.css'

const SUBSCRIPTION_GHOST_FACTS = ['first', 'second', 'third', 'fourth', 'fifth']

export const SubscriptionSkeleton = () => (
  <>
    <p role="status" aria-label="Carregando assinatura" className="sr-only">
      Carregando assinatura
    </p>

    <Card>
      <Box wrap align="end" justify="between" gap={3} className={styles.plan}>
        <Box>
          <Skeleton variant="text" className={styles.ghostPlanLabel} />
          <Skeleton variant="text" className={styles.ghostPlanName} />
        </Box>
        <Skeleton variant="text" className={styles.ghostPrice} />
      </Box>

      <dl className={styles.facts}>
        {SUBSCRIPTION_GHOST_FACTS.map((fact) => (
          <Box
            key={fact}
            align="baseline"
            justify="between"
            gap={3}
            className={styles.fact}
          >
            <Skeleton variant="text" className={styles.ghostFactLabel} />
            <Skeleton variant="text" className={styles.ghostFactValue} />
          </Box>
        ))}
      </dl>
    </Card>
  </>
)
