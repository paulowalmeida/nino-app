import { Flexbox } from '@nino/ds/components/Flexbox'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { useStoreOpen } from '@hooks/store/useStoreOpen'

import styles from './StoreSign.module.css'
import motion from '@styles/motion.module.css'

export type StoreSignProps = {
  tenantId: string | null
  timezone: string | null
}

export const StoreSign = ({ tenantId, timezone }: StoreSignProps) => {
  const { isOpen, isPending, hasSchedule } = useStoreOpen(tenantId, timezone)

  if (isPending) {
    return <Skeleton className={styles.skeleton} />
  }

  if (!hasSchedule) return null

  return (
    <Flexbox
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
        className={styles.label}
      >
        {isOpen ? 'Aberta agora' : 'Fechada agora'}
      </Text>
    </Flexbox>
  )
}
