import { describe, expect, it, vi } from 'vitest'

import { stepLine } from './step-line'

describe(stepLine.name, () => {
  it('changes and removes the requested line', () => {
    const set = vi.fn()
    stepLine(set, 'item-1', -1)
    expect(
      set.mock.calls[0][0]({ lines: [{ productId: 'item-1', quantity: 1 }] })
    ).toEqual({ lines: [] })
  })
})
