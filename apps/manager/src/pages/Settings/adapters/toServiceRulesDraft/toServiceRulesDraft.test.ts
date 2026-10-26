import { describe, expect, it } from 'vitest'

import { toServiceRulesDraft } from './toServiceRulesDraft'
import { serviceRulesSettingsMock } from './toServiceRulesDraft.mock'

describe(toServiceRulesDraft.name, () => {
  it('converts API settings to the form representation', () => {
    expect(toServiceRulesDraft(serviceRulesSettingsMock)).toEqual({
      isDeliveryEnabled: true,
      isPickupEnabled: false,
      isCounterEnabled: true,
      showAddressOnStoreInfo: true,
      allowGuestOrder: true,
      requireCpf: true,
      minOrderAmount: '25,00',
      preparationMinutes: '35',
      deliveryMinutes: '15',
      acceptedPaymentMethods: ['PIX'],
    })
  })
})
