import type { UnitSettings } from '@shared/types/settings/unit-settings'

export const serviceRulesSettingsMock = {
  isDeliveryEnabled: true,
  isPickupEnabled: true,
  isCounterEnabled: false,
  showAddressOnStoreInfo: true,
  allowGuestOrder: true,
  requireCpf: true,
  minOrderAmount: 25,
  preparationMinutes: 35,
  deliveryMinutes: 15,
  acceptedPaymentMethods: ['PIX' as const],
  cashbackEnabled: false,
  cashbackPercent: 0,
  cashbackMinRedeem: 0,
  cashbackExpiresInDays: null,
} satisfies UnitSettings
