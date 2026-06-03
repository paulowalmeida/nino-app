export type TenantPaymentMethod = {
  id: string
  tenantId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  method: { name: string; description: string | null }
}
