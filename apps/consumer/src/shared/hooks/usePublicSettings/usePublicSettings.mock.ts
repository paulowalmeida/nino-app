import type { PublicTenantSettings } from '@custom_types/settings/public-tenant-settings'

export const usePublicSettingsMock: { settings: PublicTenantSettings } = {
  settings: {
    acceptedPaymentMethods: ['CASH'],
    preparationMinutes: 20,
    deliveryMinutes: 35,
    minOrderAmount: 0,
  },
}
