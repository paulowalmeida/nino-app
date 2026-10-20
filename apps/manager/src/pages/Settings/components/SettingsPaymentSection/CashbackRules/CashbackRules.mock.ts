import type { UnitSettings } from '@shared/types/settings/unit-settings'

export const cashbackRulesSettingsMock = {
  isDeliveryEnabled: true,
  isPickupEnabled: false,
  isCounterEnabled: false,
  showAddressOnStoreInfo: true,
  allowGuestOrder: true,
  requireCpf: false,
  minOrderAmount: 0,
  preparationMinutes: 30,
  deliveryMinutes: 0,
  acceptedPaymentMethods: [],
  cashbackEnabled: true,
  cashbackPercent: 5,
  cashbackMinRedeem: 10,
  cashbackExpiresInDays: null,
} satisfies UnitSettings

export const cashbackRulesOffMock = {
  ...cashbackRulesSettingsMock,
  cashbackEnabled: false,
} satisfies UnitSettings
