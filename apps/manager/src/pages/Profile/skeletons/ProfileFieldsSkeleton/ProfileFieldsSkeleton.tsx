import { Grid } from '@nino/ds/components/Grid'
import { Skeleton } from '@nino/ds/components/Skeleton'

import { PROFILE_GHOST_FIELDS } from '../../constants/profile.constants'

import motion from '@styles/motion.module.css'
import styles from './ProfileFieldsSkeleton.module.css'

export const ProfileFieldsSkeleton = () => (
  <Grid
    columns={{ mobile: 1, tablet: 2 }}
    gap={4}
    mt={6}
    className={motion.settle}
  >
    {PROFILE_GHOST_FIELDS.map((size, index) => (
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
