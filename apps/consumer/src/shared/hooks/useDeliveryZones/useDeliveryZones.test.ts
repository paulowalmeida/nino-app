import { describe, expect, it } from 'vitest'
import { useDeliveryZones } from './useDeliveryZones'
describe('useDeliveryZones', () => {
  it('exposes the delivery zones hook', () => {
    expect(useDeliveryZones).toBeTypeOf('function')
  })
})
