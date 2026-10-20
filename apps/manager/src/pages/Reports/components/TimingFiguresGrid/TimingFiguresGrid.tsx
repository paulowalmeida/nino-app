import { Box } from '@nino/ds/components/Box'
import { CountUp } from '@nino/ds/components/CountUp'
import { Text } from '@nino/ds/components/Text'
import { REPORTS_TIMING_FIGURES } from '@pages/Reports/constants/reports.constants'
import type { TimingReport } from '@shared/types/order/timing-report'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './TimingFiguresGrid.module.css'

export type TimingFiguresGridProps = {
  timing: TimingReport
  delay?: number
}

export const TimingFiguresGrid = ({
  timing,
  delay = 0,
}: TimingFiguresGridProps) => (
  <Box className={styles.figures}>
    {REPORTS_TIMING_FIGURES.map(({ key, sampleKey, label, empty }, index) => {
      const noSample = timing[sampleKey] === 0

      return (
        <Box
          key={key}
          className={`${motion.deal} ${motion.lift} ${styles.figure}`}
          style={riseDelay(delay + index * 70)}
        >
          <Text
            as="span"
            className={
              noSample ? styles.valueEmpty : styles.timingFiguresGridValue
            }
          >
            {noSample ? (
              empty
            ) : (
              <>
                <CountUp value={Math.round(timing[key])} /> min
              </>
            )}
          </Text>
          <Text as="span" className={styles.timingFiguresGridLabel}>
            {label}
          </Text>
        </Box>
      )
    })}
  </Box>
)
