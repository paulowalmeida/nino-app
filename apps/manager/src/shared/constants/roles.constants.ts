import type { UnitRole } from '@shared/types/auth/unit-role'

export const UNIT_MANAGER_ROLES = ['UNIT_OWNER', 'MANAGER'] as const

export const HOME_SECTION_BY_UNIT_ROLE = {
  UNIT_OWNER: 'visao-geral',
  MANAGER: 'visao-geral',
  STAFF: 'balcao',
} as const satisfies Readonly<Record<UnitRole, string>>
