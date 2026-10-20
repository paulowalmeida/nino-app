import { Box } from '@nino/ds/components/Box'
import { ListRow } from '@nino/ds/components/ListRow'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { MENU_BOARD_GHOST_ROWS } from '@pages/Catalog/constants/catalog.constants'

import toolbarStyles from '@pages/Catalog/components/CatalogContent/CatalogControls/CatalogControls.module.css'
import rowStyles from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRow.module.css'
import contentStyles from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowContent/MenuRowContent.module.css'
import styles from '@pages/Catalog/skeletons/CatalogContent/CatalogContentSkeleton.module.css'

export const CatalogContentSkeleton = () => (
  <Box className={styles.wrap}>
    <Box
      direction="row"
      align="center"
      gap={2}
      className={toolbarStyles.catalogControlsToolbar}
    >
      <Skeleton className={styles.selectToggle} />
      <Skeleton className={styles.tally} />
    </Box>

    <Box className={styles.scroll}>
      <Box className={styles.catalogContentSkeletonList}>
        <Box as="ul" direction="column">
          {MENU_BOARD_GHOST_ROWS.map((row) => (
            <ListRow
              divider="none"
              padding={0}
              gap={0}
              key={row}
              className={rowStyles.menuRowItem}
            >
              <Box direction="row" className={contentStyles.itemLink}>
                <Skeleton className={styles.thumb} />
                <Box className={contentStyles.itemText}>
                  <Skeleton className={styles.name} />
                  <Skeleton
                    className={styles.catalogContentSkeletonDescription}
                  />
                </Box>
                <Skeleton className={styles.price} />
              </Box>
              <Skeleton className={styles.switch} />
              <Skeleton className={styles.delete} />
            </ListRow>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
)
