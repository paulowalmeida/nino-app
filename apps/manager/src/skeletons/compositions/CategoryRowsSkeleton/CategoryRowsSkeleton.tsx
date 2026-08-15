import { Flexbox } from '@nino/ds/components/Flexbox'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { CATEGORIES_GHOST_ROWS } from '@constants/product.constants'

import styles from './CategoryRowsSkeleton.module.css'

export const CategoryRowsSkeleton = () => (
  <Flexbox gap={2}>
    {CATEGORIES_GHOST_ROWS.map((row) => (
      <div key={row} className={styles.row}>
        <Skeleton className={styles.ghostHandle} />
        <div className={styles.who}>
          <Skeleton className={styles.ghostName} />
          <Skeleton className={styles.ghostHint} />
        </div>
        <Flexbox gap={1} align="center" shrink={false}>
          <Skeleton className={styles.ghostAction} />
          <Skeleton className={styles.ghostAction} />
        </Flexbox>
      </div>
    ))}
  </Flexbox>
)
