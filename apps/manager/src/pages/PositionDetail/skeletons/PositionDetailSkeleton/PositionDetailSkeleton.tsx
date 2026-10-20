import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import styles from './PositionDetailSkeleton.module.css'

export const PositionDetailSkeleton = () => (
  <Box aria-busy="true" className={styles.skeleton}>
    <Text as="p" role="status" className="sr-only">
      Carregando o cargo
    </Text>
    <Skeleton className={styles.title} />
    <Box className={styles.layout}>
      <Skeleton className={styles.form} />
      <Skeleton className={styles.summary} />
    </Box>
  </Box>
)
