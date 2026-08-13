import type { Membership } from '@custom_types/auth/membership'

export const unitLabel = (total: number): string =>
  total === 1 ? '1 unidade' : `${total} unidades`

export const currentOrFirstUnit = (units: Membership[]): Membership =>
  units.find(({ isCurrent }) => isCurrent) ?? units[0]
