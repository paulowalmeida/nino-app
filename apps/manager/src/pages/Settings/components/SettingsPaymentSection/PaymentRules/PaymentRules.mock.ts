import type { UnitSettings } from '@shared/types/settings/unit-settings.type'

export const paymentRulesSettingsMock = {
  isDeliveryEnabled: true,
  isPickupEnabled: true,
  isCounterEnabled: false,
  showAddressOnStoreInfo: true,
  allowGuestOrder: true,
  requireCpf: false,
  minOrderAmount: 25,
  preparationMinutes: 35,
  deliveryMinutes: 15,
  acceptedPaymentMethods: ['PIX' as const],
  cashbackEnabled: false,
  cashbackPercent: 0,
  cashbackMinRedeem: 0,
  cashbackExpiresInDays: null,
  serviceFeeEnabled: false,
  serviceFeePercent: 10,
} satisfies UnitSettings
