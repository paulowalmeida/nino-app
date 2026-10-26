import type { PublicUnitSettings } from '@shared/types/settings/public-unit-settings'

export const unitIdMock = 'unit-1'

export const everyFormatEnabledMock: PublicUnitSettings = {
  acceptedPaymentMethods: ['CASH'],
  preparationMinutes: 30,
  deliveryMinutes: 10,
  isDeliveryEnabled: true,
  isPickupEnabled: true,
  isCounterEnabled: true,
}

export const counterOnlyStoreMock: PublicUnitSettings = {
  ...everyFormatEnabledMock,
  isDeliveryEnabled: false,
  isPickupEnabled: false,
}

export const noFormatEnabledMock: PublicUnitSettings = {
  ...everyFormatEnabledMock,
  isDeliveryEnabled: false,
  isPickupEnabled: false,
  isCounterEnabled: false,
}
