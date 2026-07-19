import type { AuthUser } from '@custom_types/auth'

/** Quem leva o pedido. Sem papel de painel — entregador não é staff. */
export type CourierMember = {
  tenantId: string
  isActive: boolean
  createdAt: string
  courier: AuthUser
}
