import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'

import motion from '@styles/motion.module.css'
import styles from './StoreSign.module.css'

export const StoreSign = () => {
  const { storeOpen } = useOverviewFacade()
  const { isOpen, isPending, hasSchedule } = storeOpen

  if (isPending) {
    return <Skeleton className={styles.skeleton} />
  }

  if (!hasSchedule) return null

  return (
    <Box
      direction="row"
      align="center"
      gap={1.5}
      className={`${motion.pop} ${styles.sign}`}
    >
      <span
        aria-hidden="true"
        className={isOpen ? `${styles.dot} ${styles.dotOpen}` : styles.dot}
      />
      <Text
        as="span"
        size="xs"
        weight="bold"
        color={isOpen ? 'success' : 'faint'}
        className={styles.storeSignLabel}
      >
        {isOpen ? 'Aberta agora' : 'Fechada agora'}
      </Text>
    </Box>
  )
}
