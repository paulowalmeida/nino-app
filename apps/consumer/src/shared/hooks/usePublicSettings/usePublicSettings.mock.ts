import type { PublicUnitSettings } from '@custom_types/settings/public-unit-settings'

export const usePublicSettingsMock: { settings: PublicUnitSettings } = {
  settings: {
    acceptedPaymentMethods: ['CASH'],
    preparationMinutes: 20,
    deliveryMinutes: 35,
    minOrderAmount: 0,
  },
}
