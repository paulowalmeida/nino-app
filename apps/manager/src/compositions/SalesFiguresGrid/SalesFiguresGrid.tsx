import { CountUp } from '@nino/ds/components/CountUp'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Grid } from '@nino/ds/components/Grid'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { REPORTS_FIGURES } from '@constants/order.constants'
import type { SalesReport } from '@custom_types/order/sales-report'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import styles from './SalesFiguresGrid.module.css'
import motion from '@styles/motion.module.css'

export type SalesFiguresGridProps = {
  report: SalesReport | undefined
  isPending: boolean
}

export const SalesFiguresGrid = ({
  report,
  isPending,
}: SalesFiguresGridProps) => (
  <Grid
    columns={{ mobile: 2, tablet: 3 }}
    gap={{ mobile: 2, desktop: 4 }}
    mb={{ mobile: 4, desktop: 8 }}
  >
    {REPORTS_FIGURES.map(({ key, label, money }, index) => (
      <Flexbox
        key={key}
        gap={1}
        className={`${motion.settle} ${styles.figure}`}
        style={riseDelay(index * 60)}
      >
        <Text as="span" className={styles.value}>
          {isPending || !report ? (
            <Skeleton
              className={money ? styles.ghostMoney : styles.ghostCount}
            />
          ) : money ? (
            brl(report[key])
          ) : (
            <CountUp value={report[key]} />
          )}
        </Text>
        <Text as="span" className={styles.label}>
          {label}
        </Text>
      </Flexbox>
    ))}
  </Grid>
)
