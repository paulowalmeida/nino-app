import { describe, expect, it } from 'vitest'
import { useCreateGuestOrder } from './useCreateGuestOrder'
describe('useCreateGuestOrder', () => {
  it('exposes a mutation hook', () => {
    expect(useCreateGuestOrder).toBeTypeOf('function')
  })
})
