export const tenantIdMock = 'tenant-1'

export const tenantSettingsMock = {
  isDeliveryEnabled: true,
  isPickupEnabled: true,
  isCounterEnabled: true,
  allowGuestOrder: true,
  requireCpf: false,
  minOrderAmount: 20,
  estimatedMinutes: 30,
  acceptedPaymentMethods: ['PIX' as const, 'CASH' as const],
}

export const acceptedPaymentsMock = {
  acceptedPaymentMethods: ['PIX' as const, 'CASH' as const],
}

export const updateTenantSettingsRequestMock = {
  ...tenantSettingsMock,
  minOrderAmount: 25,
}
