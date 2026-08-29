import { describe, expect, it } from 'vitest'

import { deliveryZoneService } from './delivery-zone.service'

describe('deliveryZoneService', () => {
  it('exposes public zones and delivery quote actions', () => {
    expect(deliveryZoneService.listPublic).toBeTypeOf('function')
    expect(deliveryZoneService.getQuote).toBeTypeOf('function')
  })
})
