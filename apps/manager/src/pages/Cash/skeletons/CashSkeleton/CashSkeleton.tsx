import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import styles from './CashSkeleton.module.css'

export const CashSkeleton = () => (
  <Box
    direction="column"
    aria-label="Carregando o caixa"
    className={styles.page}
  >
    <Box direction="column" className={styles.card}>
      <Skeleton className={styles.title} />
      <Box direction="row" wrap className={styles.figures}>
        <Skeleton className={styles.figure} />
        <Skeleton className={styles.figure} />
        <Skeleton className={styles.figure} />
        <Skeleton className={styles.figure} />
      </Box>
      <Skeleton className={styles.expected} />
    </Box>
    <Box direction="row" className={styles.actions}>
      <Skeleton className={styles.action} />
      <Skeleton className={styles.action} />
      <Skeleton className={styles.action} />
    </Box>
  </Box>
)
