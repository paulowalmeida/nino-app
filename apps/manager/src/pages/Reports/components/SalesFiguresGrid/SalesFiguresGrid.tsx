import { Box } from '@nino/ds/components/Box'
import { CountUp } from '@nino/ds/components/CountUp'
import { Grid } from '@nino/ds/components/Grid'
import { Text } from '@nino/ds/components/Text'
import { REPORTS_FIGURES } from '@pages/Reports/constants/reports.constants'
import type { SalesReport } from '@shared/types/order/sales-report'
import { brl } from '@shared/utils/money/money'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './SalesFiguresGrid.module.css'

export type SalesFiguresGridProps = {
  report: SalesReport
  delay?: number
}

export const SalesFiguresGrid = ({ report, delay = 0 }: SalesFiguresGridProps) => (
  <Grid
    columns={{ mobile: 2, tablet: 3 }}
    gap={{ mobile: 2, desktop: 4 }}
    mb={{ mobile: 4, desktop: 8 }}
  >
    {REPORTS_FIGURES.map(({ key, label, money }, index) => (
      <Box
        key={key}
        gap={1}
        className={`${motion.settle} ${motion.lift} ${styles.figure}`}
        style={riseDelay(delay + index * 70)}
      >
        <Text as="span" className={styles.salesFiguresGridValue}>
          {money ? brl(report[key]) : <CountUp value={report[key]} />}
        </Text>
        <Text as="span" className={styles.salesFiguresGridLabel}>
          {label}
        </Text>
      </Box>
    ))}
  </Grid>
)
