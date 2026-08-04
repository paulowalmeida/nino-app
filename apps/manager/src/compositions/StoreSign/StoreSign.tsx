import { Badge } from '@nino/ds/components/Badge'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { useOpeningHours } from '@hooks/settings/useOpeningHours'
import { usePause } from '@hooks/store/usePause'
import { isStoreOpen } from '@utils/store-open'

import styles from './StoreSign.module.css'
import motion from '@styles/motion.module.css'

export type StoreSignProps = {
  tenantId: string | null
  timezone: string | null
}

/**
 * The sign on the door, read from the same schedule the customer app reads.
 * Stays hidden when the schedule is unreadable — a role without access to
 * opening hours would otherwise see a store that is always closed.
 */
export const StoreSign = ({ tenantId, timezone }: StoreSignProps) => {
  const { hours, isError, isPending } = useOpeningHours(tenantId)
  const { data: pause } = usePause(tenantId)

  if (isPending) {
    return (
      <Skeleton className={styles.skeleton} />
    )
  }

  if (isError || hours.length === 0) return null

  const zone = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  /** Manual pause beats the schedule: closing it by hand really closes it. */
  const isOpen = !pause?.isPaused && isStoreOpen(hours, zone)

  return (
    <Badge
      variant={isOpen ? 'success' : 'default'}
      className={`${motion.pop} ${styles.sign}`}
    >
      <span
        className={isOpen ? `${styles.bulb} ${styles.bulbOn}` : styles.bulb}
      />
      {isOpen ? 'Aberta agora' : 'Fechada agora'}
    </Badge>
  )
}
