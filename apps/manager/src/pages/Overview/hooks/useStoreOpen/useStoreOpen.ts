import { isStoreOpen } from '@pages/Overview/utils/store-open'
import { useOpeningHours } from '@shared/hooks/settings/useOpeningHours/useOpeningHours'

import { usePause } from '../usePause/usePause'

type StoreOpenState = {
  isOpen: boolean
  isPending: boolean
  hasSchedule: boolean
}

/**
 * Whether the storefront is taking orders right now, in the unit's own
 * timezone. Two screens read this at once — the masthead lights its rule by
 * it and the sign spells it out — so the derivation lives here instead of
 * being recomputed side by side.
 */
export const useStoreOpen = (
  unitId: string | null,
  timezone: string | null
): StoreOpenState => {
  const { hours, isError, isPending } = useOpeningHours(unitId)
  const { data: pause } = usePause(unitId)

  const zone = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  const hasSchedule = !isError && hours.length > 0
  /** Manual pause beats the schedule: closing it by hand really closes it. */
  const isOpen = hasSchedule && !pause?.isPaused && isStoreOpen(hours, zone)

  return { isOpen, isPending, hasSchedule }
}
