import { describe, expect, it } from 'vitest'

import { ticketNumber } from './order-ticket'

describe('ticketNumber', () => {
  it('formats the backend order number without UUID characters', () => {
    expect(ticketNumber(1042)).toBe('1042')
  })
})
