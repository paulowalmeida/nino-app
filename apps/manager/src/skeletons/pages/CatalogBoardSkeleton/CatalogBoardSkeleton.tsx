import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { MENU_BOARD_GHOST_ROWS } from '@constants/product.constants'
import rowStyles from '@molecules/MenuRow/MenuRow.module.css'

import styles from './CatalogBoardSkeleton.module.css'

export const CatalogBoardSkeleton = () => (
  <Box className={styles.wrap}>
    <Skeleton className={styles.tally} />

    <Box className={styles.scroll}>
      <Box className={styles.list}>
        <Box as="ul" direction="column">
          {MENU_BOARD_GHOST_ROWS.map((row) => (
            <li key={row} className={rowStyles.item}>
              <Box className={rowStyles.itemLink}>
                <Skeleton className={styles.thumb} />
                <Box className={rowStyles.itemText}>
                  <Skeleton className={styles.name} />
                  <Skeleton className={styles.description} />
                </Box>
                <Skeleton className={styles.price} />
              </Box>
              <Skeleton className={styles.switch} />
            </li>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
)
