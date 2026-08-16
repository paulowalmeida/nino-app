import { Flexbox } from '@nino/ds/components/Flexbox'

import { DAY_TALLY_SKELETON_ROWS } from '@constants/order.constants'
import { Skeleton } from '@nino/ds/components/Skeleton'

import styles from './DayTallySkeleton.module.css'

export const DayTallySkeleton = () => {
  return (
    <Flexbox as="ul" direction="column" mt={4}>
      {DAY_TALLY_SKELETON_ROWS.map((row) => (
        <li key={row} className={styles.entry}>
          <div className={styles.skeletonRow}>
            <Skeleton className={styles.skeletonTicket} />
            <Skeleton className={styles.skeletonState} />
            <Skeleton className={styles.skeletonAt} />
            <Skeleton className={styles.skeletonTotal} />
          </div>
        </li>
      ))}
    </Flexbox>
  )
}
