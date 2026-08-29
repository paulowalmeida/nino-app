import { describe, expect, it } from 'vitest'

import { orderCook } from './order-cook'
import { cookOrderMock, kitchenStaffMock } from './order-cook.mock'

describe('orderCook', () => {
  it('finds the staff member who started preparing the order', () => {
    expect(orderCook(cookOrderMock, kitchenStaffMock)).toBe('Marina Silva')
  })

  it('does not invent a cook when the preparation event has no staff match', () => {
    expect(orderCook(cookOrderMock, [])).toBeNull()
  })
})
