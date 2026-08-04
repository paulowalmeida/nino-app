import type {
  TenantSettings,
  UpdateTenantSettingsRequest,
} from '@custom_types/settings'

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

export const settingsUpdate: UpdateTenantSettingsRequest = {
  minOrderAmount: 35,
  allowGuestOrder: true,
}
