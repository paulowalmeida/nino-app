import type { ServiceRulesDraft } from '@shared/types/settings/service-rules-draft'
import type { UnitSettings } from '@shared/types/settings/unit-settings.type'

export const toServiceRulesDraft = (
  settings: UnitSettings
): ServiceRulesDraft => ({
  isDeliveryEnabled: settings.isDeliveryEnabled,
  isPickupEnabled: settings.isPickupEnabled,
  isCounterEnabled: settings.isCounterEnabled,
  showAddressOnStoreInfo: settings.showAddressOnStoreInfo,
  allowGuestOrder: settings.allowGuestOrder,
  requireCpf: settings.requireCpf,
  minOrderAmount: Number(settings.minOrderAmount).toFixed(2).replace('.', ','),
  preparationMinutes: String(settings.preparationMinutes),
  deliveryMinutes: String(settings.deliveryMinutes),
  acceptedPaymentMethods: settings.acceptedPaymentMethods,
})
