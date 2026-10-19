import { Box } from '@nino/ds/components/Box'
import { ListRow } from '@nino/ds/components/ListRow'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { MENU_BOARD_GHOST_ROWS } from '@pages/Catalog/constants/catalog.constants'

import rowStyles from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRow.module.css'
import styles from '@pages/Catalog/skeletons/CatalogContent/CatalogContentSkeleton.module.css'

export const CatalogContentSkeleton = () => (
  <Box className={styles.wrap}>
    <Skeleton className={styles.tally} />

    <Box className={styles.scroll}>
      <Box className={styles.catalogContentSkeletonList}>
        <Box as="ul" direction="column">
          {MENU_BOARD_GHOST_ROWS.map((row) => (
            <ListRow divider="none" padding={0} gap={0} key={row} className={rowStyles.menuRowItem}>
              <Box className={rowStyles.itemLink}>
                <Skeleton className={styles.thumb} />
                <Box className={rowStyles.itemText}>
                  <Skeleton className={styles.name} />
                  <Skeleton className={styles.catalogContentSkeletonDescription} />
                </Box>
                <Skeleton className={styles.price} />
              </Box>
              <Skeleton className={styles.switch} />
            </ListRow>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
)
