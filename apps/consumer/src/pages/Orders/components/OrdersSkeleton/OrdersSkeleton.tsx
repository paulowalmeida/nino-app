import { Box } from '@nino/ds/components/Box'

import styles from './OrdersSkeleton.module.css'

export const OrdersSkeleton = () => (
  <Box aria-label="Carregando pedidos">
    <Box className={styles.ordersSkeletonRow} />
    <Box className={styles.ordersSkeletonRow} />
    <Box className={styles.ordersSkeletonRow} />
  </Box>
)
