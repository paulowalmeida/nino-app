import { Box } from '@nino/ds/components/Box'
import { Grid } from '@nino/ds/components/Grid'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import {
  REPORTS_FIGURES,
  REPORTS_TIMING_FIGURES,
  TOP_SALES_TABLE_GHOST_ROWS,
} from '@pages/Reports/constants/reports.constants'
import { SalesTrendSkeleton } from '@shared/skeletons/SalesTrendSkeleton/SalesTrendSkeleton'

import styles from './ReportsSkeleton.module.css'

const TREND_BLOCKS = ['period', 'channel', 'payment']
const BREAKDOWN_BLOCKS = ['channel', 'payment']

export const ReportsSkeleton = () => (
  <>
    <Text role="status" className="sr-only">
      Carregando relatório
    </Text>

    <Box aria-hidden="true">
      <Grid
        columns={{ mobile: 2, tablet: 3 }}
        gap={{ mobile: 2, desktop: 4 }}
        mb={{ mobile: 4, desktop: 8 }}
      >
        {REPORTS_FIGURES.map(({ key }) => (
          <Box key={key} gap={1} className={styles.figure}>
            <Skeleton className={styles.figureValue} />
            <Skeleton className={styles.figureLabel} />
          </Box>
        ))}
      </Grid>

      {TREND_BLOCKS.map((block) => (
        <Box key={block} as="section" className={styles.block}>
          <Skeleton className={styles.blockTitle} />
          <SalesTrendSkeleton />
        </Box>
      ))}

      <Box className={styles.timingFigures}>
        {REPORTS_TIMING_FIGURES.map(({ key }) => (
          <Box key={key} className={styles.figure}>
            <Skeleton className={styles.figureValue} />
            <Skeleton className={styles.figureLabel} />
          </Box>
        ))}
      </Box>

      <Grid
        columns={{ mobile: 1, desktop: 2 }}
        gap={4}
        mb={{ mobile: 4, desktop: 8 }}
      >
        {BREAKDOWN_BLOCKS.map((block) => (
          <Box key={block} as="section" className={styles.blockFlat}>
            <Skeleton className={styles.blockTitle} />
            <Box className={styles.bars}>
              <Skeleton className={styles.bar} />
              <Skeleton className={styles.barShort} />
              <Skeleton className={styles.barShort} />
            </Box>
          </Box>
        ))}
      </Grid>

      <Box as="section" className={styles.blockFlat}>
        <Skeleton className={styles.blockTitle} />
        {TOP_SALES_TABLE_GHOST_ROWS.map((row) => (
          <Box
            key={row}
            direction="row"
            align="center"
            className={styles.tableRow}
          >
            <Skeleton className={styles.position} />
            <Skeleton className={styles.productName} />
            <Skeleton className={styles.cell} />
          </Box>
        ))}
      </Box>
    </Box>
  </>
)
