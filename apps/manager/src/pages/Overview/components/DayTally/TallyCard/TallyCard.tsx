import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { Card } from '@nino/ds/components/Card'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './TallyCard.module.css'

type TallyCardProps = {
  to: string
  ariaLabel: string
  label: string
  isPending: boolean
  value: ReactNode
  skeletonClassName: string
  delay?: number
}

export const TallyCard = ({
  to,
  ariaLabel,
  label,
  isPending,
  value,
  skeletonClassName,
  delay = 0,
}: TallyCardProps) => (
  <Card
    variant="flat"
    padding="lg"
    asChild
    className={`${motion.settle} ${motion.lift} ${styles.figure}`}
  >
    <Link
      to={to}
      relative="path"
      aria-label={ariaLabel}
      style={riseDelay(delay)}
    className={styles.cardOverview}
    >
      <Text as="span" className={styles.tallyCardValue}>
        {isPending ? <Skeleton className={skeletonClassName} /> : value}
      </Text>
      <Text as="span" className={styles.metricLabel}>
        {label}
      </Text>
    </Link>
  </Card>
)
