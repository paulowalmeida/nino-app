import { describe, expect, it, vi } from 'vitest'

import type { NewOrderState } from '@pages/NewOrder/types/NewOrderState.type'

import { addLine } from './add-line'
import { existingLineMock, newLineMock, otherLineMock } from './add-line.mock'

const applyTo = (lines: NewOrderState['lines']) => {
  const set = vi.fn()
  addLine(set, newLineMock)
  const transition = set.mock.calls[0][0] as (
    current: NewOrderState
  ) => Partial<NewOrderState>

  return transition({ lines } as NewOrderState)
}

describe('addLine', () => {
  it('opens the ticket with one unit of a new item', () => {
    expect(applyTo([]).lines).toEqual([{ ...newLineMock, quantity: 1 }])
  })

  it('sums another unit into the line that already exists', () => {
    const { lines } = applyTo([existingLineMock, otherLineMock])

    expect(lines?.[0].quantity).toBe(3)
    expect(lines?.[1]).toEqual(otherLineMock)
  })
})
