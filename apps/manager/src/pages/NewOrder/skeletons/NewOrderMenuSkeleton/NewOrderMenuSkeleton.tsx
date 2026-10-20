import { Box } from '@nino/ds/components/Box'
import { ListRow } from '@nino/ds/components/ListRow'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  NEW_ORDER_MENU_GHOST_ITEMS,
  NEW_ORDER_MENU_GHOST_SECTIONS,
} from '@pages/NewOrder/constants/new-order.constants'

import styles from './NewOrderMenuSkeleton.module.css'

export const NewOrderMenuSkeleton = () => (
  <Box
    as="section"
    className={styles.newOrderMenuSkeletonMenu}
    aria-label="Carregando cardápio"
  >
    {NEW_ORDER_MENU_GHOST_SECTIONS.map((section) => (
      <Box as="section" key={section}>
        <Skeleton variant="text" className={styles.ghostSectionName} />

        <Box as="ul" direction="column">
          {NEW_ORDER_MENU_GHOST_ITEMS.map((item) => (
            <ListRow key={item} className={styles.newOrderMenuSkeletonItem}>
              <Skeleton className={styles.ghostThumb} />
              <Skeleton variant="text" className={styles.ghostItemName} />
              <Skeleton variant="text" className={styles.ghostItemPrice} />
              <Skeleton className={styles.ghostAddButton} />
            </ListRow>
          ))}
        </Box>
      </Box>
    ))}
  </Box>
)
