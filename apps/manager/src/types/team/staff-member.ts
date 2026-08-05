import type { AuthUser } from '@custom_types/auth/auth-user'
import type { TenantRole } from '@custom_types/auth/tenant-role'
/** Quem trabalha no painel desta loja. */
export type StaffMember = {
  tenantId: string
  role: TenantRole
  isCurrent: boolean
  createdAt: string
  user: AuthUser
}
