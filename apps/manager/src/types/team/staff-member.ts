import type { AuthUser, TenantRole } from '@custom_types/auth'

/** Quem trabalha no painel desta loja. */
export type StaffMember = {
  tenantId: string
  role: TenantRole
  isCurrent: boolean
  createdAt: string
  user: AuthUser
}
