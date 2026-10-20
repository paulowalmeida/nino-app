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
}

export const SalesFiguresGrid = ({ report }: SalesFiguresGridProps) => (
  <Grid
    columns={{ mobile: 2, tablet: 3 }}
    gap={{ mobile: 2, desktop: 4 }}
    mb={{ mobile: 4, desktop: 8 }}
  >
    {REPORTS_FIGURES.map(({ key, label, money }, index) => (
      <Box
        key={key}
        gap={1}
        className={`${motion.settle} ${styles.figure}`}
        style={riseDelay(index * 60)}
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
