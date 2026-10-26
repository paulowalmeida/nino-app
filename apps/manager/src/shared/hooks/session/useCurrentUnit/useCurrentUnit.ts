import { useSessionStore } from '@shared/states/session/session.state'
import type { Membership } from '@shared/types/auth/membership'

/** Membership of the unit addressed by the current route, when known. */
export const useCurrentUnit = (): Membership | null =>
  useSessionStore(
    ({ memberships, currentUnitId }) =>
      memberships.find(({ unitId }) => unitId === currentUnitId) ?? null
  )
