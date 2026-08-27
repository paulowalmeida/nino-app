import type { Membership } from '@shared/types/auth/membership'

export const currentOrFirstUnit = (units: Membership[]): Membership =>
  units.find(({ isCurrent }) => isCurrent) ?? units[0]
