import type { PublicTenantSettings } from '@shared/types/settings/public-tenant-settings'

export const tenantIdMock = 'tenant-1'

export const everyFormatEnabledMock: PublicTenantSettings = {
  acceptedPaymentMethods: ['CASH'],
  preparationMinutes: 30,
  deliveryMinutes: 10,
  isDeliveryEnabled: true,
  isPickupEnabled: true,
  isCounterEnabled: true,
}

export const counterOnlyStoreMock: PublicTenantSettings = {
  ...everyFormatEnabledMock,
  isDeliveryEnabled: false,
  isPickupEnabled: false,
}

export const noFormatEnabledMock: PublicTenantSettings = {
  ...everyFormatEnabledMock,
  isDeliveryEnabled: false,
  isPickupEnabled: false,
  isCounterEnabled: false,
}
