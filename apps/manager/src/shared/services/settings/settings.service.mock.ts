export const tenantIdMock = 'tenant-1'

export const tenantSettingsMock = {
  isDeliveryEnabled: true,
  isPickupEnabled: true,
  isCounterEnabled: true,
  allowGuestOrder: true,
  requireCpf: false,
  minOrderAmount: 20,
  preparationMinutes: 30,
  deliveryMinutes: 10,
  acceptedPaymentMethods: ['PIX' as const, 'CASH' as const],
}

export const publicTenantSettingsMock = {
  acceptedPaymentMethods: ['PIX' as const, 'CASH' as const],
  preparationMinutes: 30,
  deliveryMinutes: 10,
  isDeliveryEnabled: true,
  isPickupEnabled: true,
  isCounterEnabled: false,
}

export const updateTenantSettingsRequestMock = {
  ...tenantSettingsMock,
  minOrderAmount: 25,
}
