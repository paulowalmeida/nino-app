import { describe, expect, it, vi } from 'vitest'

import { startDrag } from './start-drag'
import { orderIdMock } from './start-drag.mock'

describe('startDrag', () => {
  it('lifts the order', () => {
    const set = vi.fn()
    startDrag(set, orderIdMock)
    expect(set).toHaveBeenCalledWith({ draggingOrderId: orderIdMock })
  })
})
