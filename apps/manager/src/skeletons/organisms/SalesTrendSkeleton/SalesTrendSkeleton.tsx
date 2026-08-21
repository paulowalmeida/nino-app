import { SALES_TREND_SKELETON_DAYS } from "@constants/order.constants"
import { Box } from "@ds/components/Box/Box"
import { Skeleton } from "@ds/components/Skeleton/Skeleton"

import styles from './SalesTrendSkeleton.module.css'

export const SalesTrendSkeleton = () => {
  return (
    <div className={styles.skeletonChart}>
      <div className={styles.skeletonAxis}>
        <Skeleton className={styles.skeletonTick} />
        <Skeleton className={styles.skeletonTick} />
        <Skeleton className={styles.skeletonTick} />
        <Skeleton className={styles.skeletonTick} />
      </div>
      <div className={styles.skeletonPlot}>
        <Skeleton className={styles.skeletonLine} />
        <Box direction="row" justify="between" shrink={false} mt={2}>
          {SALES_TREND_SKELETON_DAYS.map((day) => (
            <Skeleton key={day} className={styles.skeletonDay} />
          ))}
        </Box>
      </div>
    </div>
  )
}
