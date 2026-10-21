import type { Membership } from '@shared/types/auth/membership'

type SwitchTarget = Pick<Membership, 'unitId' | 'role' | 'permissions'>

export const catalogManagerMock: SwitchTarget = {
  unitId: 'unit-2',
  role: 'MANAGER',
  permissions: ['catalog.manage'],
}

export const cashierMock: SwitchTarget = {
  unitId: 'unit-2',
  role: 'MANAGER',
  permissions: [],
}
