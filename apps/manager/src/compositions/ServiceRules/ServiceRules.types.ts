import type { PaymentMethod } from '@custom_types/order'
import type {
  TenantSettings,
  UpdateTenantSettingsRequest,
} from '@custom_types/settings'

export type ServiceRulesProps = {
  settings: TenantSettings | undefined
  isPending: boolean
  isSaving: boolean
  onSave: (data: UpdateTenantSettingsRequest) => void
}

export type ServiceRulesDraft = {
  isDeliveryEnabled: boolean
  isPickupEnabled: boolean
  isCounterEnabled: boolean
  allowGuestOrder: boolean
  requireCpf: boolean
  minOrderAmount: string
  acceptedPaymentMethods: PaymentMethod[]
}
