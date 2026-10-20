import type { UnitSettings } from '@shared/types/settings/unit-settings.type'

export const unitIdMock = 'unit-1'

export const savedSettingsMock = {
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
  serviceFeeEnabled: false,
  serviceFeePercent: 10,
} satisfies UnitSettings
