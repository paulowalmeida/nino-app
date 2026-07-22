import type { PaymentMethod } from '@custom_types/order'

/** Regras de atendimento da loja. Valores monetários chegam como string. */
export type TenantSettings = {
  id: string
  tenantId: string
  requireAccount: boolean
  requireCpf: boolean
  allowGuestOrder: boolean
  deliveryFee: string
  minOrderAmount: string
  deliveryRadius: number
  estimatedMinutes: number
  isDeliveryEnabled: boolean
  isPickupEnabled: boolean
  isCounterEnabled: boolean
  loyaltyEnabled: boolean
  loyaltyPointsPerOrder: number
  loyaltyPointValue: string
  allowSharedStaff: boolean
  acceptedPaymentMethods: PaymentMethod[]
}
