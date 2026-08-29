import { describe, expect, it } from 'vitest'

import { orderService } from './order.service'

describe('orderService', () => {
  it('exposes guest and authenticated order actions', () => {
    expect(orderService.createGuest).toBeTypeOf('function')
    expect(orderService.getGuestStatus).toBeTypeOf('function')
    expect(orderService.getMyStatus).toBeTypeOf('function')
    expect(orderService.listMine).toBeTypeOf('function')
  })
})
