import type { TenantSettings } from '@custom_types/settings/tenant-settings'
export const baseSettings: TenantSettings = {
  id: 'settings-1',
  tenantId: 'tenant-1',
  requireAccount: false,
  requireCpf: false,
  allowGuestOrder: true,
  deliveryFee: '5.00',
  minOrderAmount: '20.00',
  deliveryRadius: 5,
  estimatedMinutes: 30,
  isDeliveryEnabled: true,
  isPickupEnabled: false,
  isCounterEnabled: false,
  loyaltyEnabled: false,
  loyaltyPointsPerOrder: 0,
  loyaltyPointValue: '0',
  allowSharedStaff: false,
  acceptedPaymentMethods: ['CASH'],
}

export const settingsWithHigherMinOrder: TenantSettings = {
  ...baseSettings,
  minOrderAmount: '35.00',
}
