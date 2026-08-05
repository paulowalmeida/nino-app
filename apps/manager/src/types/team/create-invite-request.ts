import type { TenantRole } from '@custom_types/auth/tenant-role'
/** `role` é exigida para STAFF e proibida para COURIER. */
export type CreateInviteRequest = {
  email: string
  kind: 'STAFF' | 'COURIER'
  role?: TenantRole
}
