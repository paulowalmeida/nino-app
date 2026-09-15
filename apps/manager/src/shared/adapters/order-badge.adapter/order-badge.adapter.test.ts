import { describe, expect, it } from 'vitest'

import { toOrderBadgeVariant } from './order-badge.adapter'
import { orderBadgeStatusMock } from './order-badge.adapter.mock'

describe(toOrderBadgeVariant.name, () => {
  it('maps waiting orders to the brand variant', () => {
    expect(toOrderBadgeVariant(orderBadgeStatusMock.pending)).toBe('brand')
  })

  it('maps completed orders to the success variant', () => {
    expect(toOrderBadgeVariant(orderBadgeStatusMock.completed)).toBe('success')
  })
})
