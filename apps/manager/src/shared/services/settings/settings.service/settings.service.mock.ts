export const unitIdMock = 'unit-1'

export const unitSettingsMock = {
  isDeliveryEnabled: true,
  isPickupEnabled: true,
  isCounterEnabled: true,
  showAddressOnStoreInfo: true,
  allowGuestOrder: true,
  requireCpf: false,
  minOrderAmount: 20,
  preparationMinutes: 30,
  deliveryMinutes: 10,
  acceptedPaymentMethods: ['PIX' as const, 'CASH' as const],
}

export const publicUnitSettingsMock = {
  acceptedPaymentMethods: ['PIX' as const, 'CASH' as const],
  preparationMinutes: 30,
  deliveryMinutes: 10,
  isDeliveryEnabled: true,
  isPickupEnabled: true,
  isCounterEnabled: false,
}

export const updateUnitSettingsRequestMock = {
  ...unitSettingsMock,
  minOrderAmount: 25,
}
