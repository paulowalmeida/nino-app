import { Box } from '@nino/ds/components/Box'
import { ListRow } from '@nino/ds/components/ListRow'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { DAY_TALLY_SKELETON_ROWS } from '@pages/Overview/constants/overview.constants'

import styles from './DayTallySkeleton.module.css'

export const DayTallySkeleton = () => {
  return (
    <Box as="ul" direction="column" mt={4}>
      {DAY_TALLY_SKELETON_ROWS.map((row) => (
        <ListRow key={row} divider="none" padding={0} className={styles.entry}>
          <Box className={styles.skeletonRow}>
            <Skeleton className={styles.skeletonTicket} />
            <Skeleton className={styles.skeletonState} />
            <Skeleton className={styles.skeletonAt} />
            <Skeleton className={styles.skeletonTotal} />
          </Box>
        </ListRow>
      ))}
    </Box>
  )
}
