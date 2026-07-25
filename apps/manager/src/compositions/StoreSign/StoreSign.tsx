import { Skeleton } from '@nino/ds'

import { useOpeningHours } from '@hooks/settings/useOpeningHours'
import { usePause } from '@hooks/store/usePause'
import { isStoreOpen } from '@utils/store-open'

import type { StoreSignProps } from './StoreSign.types'

import styles from './StoreSign.module.css'
import motion from '@styles/motion.module.css'

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
      <Skeleton
        animation="none"
        className="h-[1.75rem] w-32 animate-pulse rounded-full bg-sand"
      />
    )
  }

  if (isError || hours.length === 0) return null

  const zone = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  /** Pausa manual vence o horário: quem fechou na mão fechou de verdade. */
  const open = !pause?.isPaused && isStoreOpen(hours, zone)

  return (
    <span className={`${motion.pop} ${styles.sign} ${open ? styles.open : ''}`}>
      <span className={styles.bulb} />
      {open ? 'Aberta agora' : 'Fechada agora'}
    </span>
  )
}
