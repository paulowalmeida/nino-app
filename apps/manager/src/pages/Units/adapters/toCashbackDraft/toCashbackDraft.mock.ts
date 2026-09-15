import type { UnitSettings } from '@shared/types/settings/unit-settings'

export const cashbackSettingsMock = {
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
  cashbackPercent: 7.5,
  cashbackMinRedeem: 12.4,
  cashbackExpiresInDays: null,
} satisfies UnitSettings
