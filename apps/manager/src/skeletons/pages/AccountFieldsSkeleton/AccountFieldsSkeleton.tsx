import { Grid } from '@nino/ds/components/Grid'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { ACCOUNT_GHOST_FIELDS } from '@constants/account.constants'

import styles from './AccountFieldsSkeleton.module.css'
import motion from '@styles/motion.module.css'

export const AccountFieldsSkeleton = () => (
  <Grid
    columns={{ mobile: 1, tablet: 2 }}
    gap={4}
    mt={6}
    className={motion.settle}
  >
    {ACCOUNT_GHOST_FIELDS.map((size, index) => (
      <Skeleton
        key={index}
        className={
          size === 'wide'
            ? `${styles.wide} ${styles.ghostField}`
            : styles.ghostField
        }
      />
    ))}
  </Grid>
)
