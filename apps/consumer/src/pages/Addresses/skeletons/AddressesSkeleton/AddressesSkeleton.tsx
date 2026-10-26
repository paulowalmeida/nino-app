import { Box } from '@nino/ds/components/Box'

import styles from './AddressesSkeleton.module.css'

export const AddressesSkeleton = () => (
  <Box aria-label="Carregando endereços">
    <Box className={styles.addressesSkeletonRow} />
    <Box className={styles.addressesSkeletonRow} />
  </Box>
)
