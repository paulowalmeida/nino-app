import type { UnitRole } from '@shared/types/auth/unit-role'

export type CreateInviteRequest = {
  email: string
  kind: 'STAFF' | 'COURIER'
  role?: Extract<UnitRole, 'MANAGER' | 'STAFF'>
}
