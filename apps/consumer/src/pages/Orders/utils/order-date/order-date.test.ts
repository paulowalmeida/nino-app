import { describe, expect, it } from 'vitest'

import { orderDateLabel } from './order-date'

describe('orderDateLabel', () => {
  it('formats an order creation date for the account list', () => {
    expect(orderDateLabel('2026-08-20T18:30:00.000Z')).toMatch(/20\/08\/26/)
  })
})
