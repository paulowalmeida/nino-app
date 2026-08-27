import { Box } from "@ds/components/Box/Box"
import { Skeleton } from "@ds/components/Skeleton/Skeleton"
import { SALES_TREND_SKELETON_DAYS } from '@shared/constants/chart.constants'

import styles from './SalesTrendSkeleton.module.css'

export const SalesTrendSkeleton = () => {
  return (
    <Box className={styles.skeletonChart}>
      <Box className={styles.skeletonAxis}>
        <Skeleton className={styles.skeletonTick} />
        <Skeleton className={styles.skeletonTick} />
        <Skeleton className={styles.skeletonTick} />
        <Skeleton className={styles.skeletonTick} />
      </Box>
      <Box className={styles.skeletonPlot}>
        <Skeleton className={styles.skeletonLine} />
        <Box direction="row" justify="between" shrink={false} mt={2}>
          {SALES_TREND_SKELETON_DAYS.map((day) => (
            <Skeleton key={day} className={styles.skeletonDay} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
