import { describe, expect, it, vi } from 'vitest'

import type { NewOrderState } from '@pages/NewOrder/types/NewOrderState.type'

import { stepLine } from './step-line'
import { ticketLinesMock } from './step-line.mock'

const applyTo = (productId: string, by: number) => {
  const set = vi.fn()
  stepLine(set, productId, by)
  const transition = set.mock.calls[0][0] as (
    current: NewOrderState
  ) => Partial<NewOrderState>

  return transition({ lines: ticketLinesMock } as NewOrderState)
}

describe('stepLine', () => {
  it('adds one unit to the chosen line only', () => {
    const { lines } = applyTo('product-1', 1)

    expect(lines?.[0].quantity).toBe(3)
    expect(lines?.[1].quantity).toBe(1)
  })

  it('takes one unit from the chosen line', () => {
    expect(applyTo('product-1', -1).lines?.[0].quantity).toBe(1)
  })

  it('drops the line when the last unit leaves', () => {
    const { lines } = applyTo('product-2', -1)

    expect(lines).toHaveLength(1)
    expect(lines?.[0].productId).toBe('product-1')
  })
})
