import { CountUp } from '@nino/ds/components/CountUp'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { REPORTS_TIMING_FIGURES } from '@constants/order.constants'
import type { TimingReport } from '@custom_types/order/timing-report'
import { riseDelay } from '@utils/rise-delay'

import styles from './TimingFiguresGrid.module.css'
import motion from '@styles/motion.module.css'

export type TimingFiguresGridProps = {
  timing: TimingReport | undefined
  isPending: boolean
}

export const TimingFiguresGrid = ({
  timing,
  isPending,
}: TimingFiguresGridProps) => (
  <div className={styles.figures}>
    {REPORTS_TIMING_FIGURES.map(({ key, sampleKey, label, empty }, index) => {
      const noSample = !isPending && timing?.[sampleKey] === 0

      return (
        <div
          key={key}
          className={`${motion.settle} ${styles.figure}`}
          style={riseDelay(index * 60)}
        >
          <Text
            as="span"
            className={noSample ? styles.valueEmpty : styles.value}
          >
            {isPending || !timing ? (
              <Skeleton className={styles.ghostCount} />
            ) : noSample ? (
              empty
            ) : (
              <>
                <CountUp value={Math.round(timing[key])} /> min
              </>
            )}
          </Text>
          <Text as="span" className={styles.label}>
            {label}
          </Text>
        </div>
      )
    })}
  </div>
)
