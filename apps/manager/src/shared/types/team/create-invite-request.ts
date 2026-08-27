import type { TenantRole } from '@shared/types/auth/tenant-role'

export type CreateInviteRequest = {
  email: string
  kind: 'STAFF' | 'COURIER'
  role?: Extract<TenantRole, 'MANAGER' | 'STAFF'>
}
