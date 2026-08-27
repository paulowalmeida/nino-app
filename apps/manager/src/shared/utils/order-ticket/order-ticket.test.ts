import { describe, expect, it } from 'vitest'

import { ticketNumber } from './order-ticket'

describe('ticketNumber', () => {
  it('reads the last four characters of the order id in uppercase', () => {
    expect(ticketNumber('order-9f3ac0')).toBe('3AC0')
  })
})
