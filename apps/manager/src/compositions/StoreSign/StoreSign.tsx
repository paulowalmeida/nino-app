import { Flexbox } from '@nino/ds/components/Flexbox'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { useOpeningHours } from '@hooks/settings/useOpeningHours'
import { usePause } from '@hooks/store/usePause'
import { isStoreOpen } from '@utils/store-open'

import styles from './StoreSign.module.css'
import motion from '@styles/motion.module.css'

export type StoreSignProps = {
  tenantId: string | null
  timezone: string | null
}

export const StoreSign = ({ tenantId, timezone }: StoreSignProps) => {
  const { hours, isError, isPending } = useOpeningHours(tenantId)
  const { data: pause } = usePause(tenantId)

  if (isPending) {
    return <Skeleton className={styles.skeleton} />
  }

  if (isError || hours.length === 0) return null

  const zone = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  /** Manual pause beats the schedule: closing it by hand really closes it. */
  const isOpen = !pause?.isPaused && isStoreOpen(hours, zone)

  const rail = isOpen
    ? `${styles.rail} ${styles.railOpen}`
    : `${styles.rail} ${styles.railClosed}`

  return (
    <Flexbox align="center" gap={2} className={`${motion.pop} ${rail}`}>
      <span
        aria-hidden="true"
        className={isOpen ? `${styles.dot} ${styles.dotOpen}` : styles.dot}
      />
      <Text
        as="span"
        size="xs"
        weight="bold"
        color={isOpen ? 'success' : 'faint'}
        className={styles.railLabel}
      >
        {isOpen ? 'Aberta agora' : 'Fechada agora'}
      </Text>
    </Flexbox>
  )
}
