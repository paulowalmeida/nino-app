import type { Membership } from '@custom_types/auth'
import type { TenantSettings } from '@custom_types/settings'

export const currentTenant = { tenantId: 'tenant-1' } as Membership

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
