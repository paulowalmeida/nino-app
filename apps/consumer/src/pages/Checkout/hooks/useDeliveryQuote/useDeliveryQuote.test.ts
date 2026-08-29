import { describe, expect, it } from 'vitest'
import { useDeliveryQuote } from './useDeliveryQuote'
describe('useDeliveryQuote', () => {
  it('exposes the delivery quote hook', () => {
    expect(useDeliveryQuote).toBeTypeOf('function')
  })
})
