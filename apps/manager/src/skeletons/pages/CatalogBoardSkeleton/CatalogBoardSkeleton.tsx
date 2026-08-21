import { Flexbox } from '@nino/ds/components/Flexbox'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { MENU_BOARD_GHOST_ROWS } from '@constants/product.constants'
import rowStyles from '@molecules/MenuRow/MenuRow.module.css'

import styles from './CatalogBoardSkeleton.module.css'

export const CatalogBoardSkeleton = () => (
  <Flexbox className={styles.wrap}>
    <Skeleton className={styles.tally} />

    <Flexbox className={styles.scroll}>
      <Flexbox className={styles.list}>
        <Flexbox as="ul" direction="column">
          {MENU_BOARD_GHOST_ROWS.map((row) => (
            <li key={row} className={rowStyles.item}>
              <Flexbox className={rowStyles.itemLink}>
                <Skeleton className={styles.thumb} />
                <Flexbox className={rowStyles.itemText}>
                  <Skeleton className={styles.name} />
                  <Skeleton className={styles.description} />
                </Flexbox>
                <Skeleton className={styles.price} />
              </Flexbox>
              <Skeleton className={styles.switch} />
            </li>
          ))}
        </Flexbox>
      </Flexbox>
    </Flexbox>
  </Flexbox>
)
