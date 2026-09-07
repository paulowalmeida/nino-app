import type { PaymentMethod } from '@shared/types/order/payment-method'

export type UpdateTenantSettingsRequest = {
  isDeliveryEnabled: boolean
  isPickupEnabled: boolean
  isCounterEnabled: boolean
  showAddressOnStoreInfo: boolean
  allowGuestOrder: boolean
  requireCpf: boolean
  minOrderAmount: number
  preparationMinutes: number
  deliveryMinutes: number
  acceptedPaymentMethods: PaymentMethod[]
  cashbackEnabled?: boolean
  cashbackPercent?: number
  cashbackMinRedeem?: number
}
