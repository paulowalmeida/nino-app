import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { CATEGORIES_GHOST_ROWS } from '@pages/CatalogCategories/constants/catalog-categories.constants'

import styles from './CategoryRowsSkeleton.module.css'

export const CategoryRowsSkeleton = () => (
  <Box gap={2}>
    {CATEGORIES_GHOST_ROWS.map((row) => (
      <Box key={row} direction="row" className={styles.categoryRowsSkeletonRow}>
        <Skeleton className={styles.ghostHandle} />
        <Box className={styles.who}>
          <Skeleton className={styles.ghostName} />
          <Skeleton className={styles.ghostHint} />
        </Box>
        <Box direction="row" gap={1} align="center" shrink={false}>
          <Skeleton className={styles.ghostAction} />
          <Skeleton className={styles.ghostAction} />
        </Box>
      </Box>
    ))}
  </Box>
)
