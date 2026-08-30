import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { PaymentMethod } from '@shared/types/order/payment-method'

import { useCounterPaymentSelection } from './useCounterPaymentSelection'
import {
  counterReceivedNoteMock,
  counterSaleTotalMock,
  counterShortAmountMock,
} from './useCounterPaymentSelection.mock'

const state: {
  chosenPaymentMethod: PaymentMethod | null
  changeFor: string
} = {
  chosenPaymentMethod: 'PIX',
  changeFor: '',
}

vi.mock('@pages/Counter/states/counter/counter.store', () => ({
  useCounterStore: (selector: (value: typeof state) => unknown) =>
    selector(state),
}))

describe(useCounterPaymentSelection.name, () => {
  beforeEach(() => {
    state.chosenPaymentMethod = 'PIX'
    state.changeFor = ''
  })

  it('keeps a selected available method', () => {
    const { result } = renderHook(() =>
      useCounterPaymentSelection(['CASH', 'PIX'])
    )
    expect(result.current.method).toBe('PIX')
  })

  it('falls back to the first available method', () => {
    const { result } = renderHook(() => useCounterPaymentSelection(['CASH']))
    expect(result.current.method).toBe('CASH')
  })

  it('returns null when no method is available', () => {
    const { result } = renderHook(() => useCounterPaymentSelection([]))
    expect(result.current.method).toBeNull()
  })

  it('closes a cash sale paid with the exact amount', () => {
    // Arrange
    state.chosenPaymentMethod = 'CASH'

    // Act
    const { result } = renderHook(() =>
      useCounterPaymentSelection(['CASH'], counterSaleTotalMock)
    )

    // Assert
    expect(result.current.isChangeValid).toBe(true)
    expect(result.current.hasChange).toBe(false)
    expect(result.current.changeAmount).toBe(0)
  })

  it('works out the change from the amount handed over', () => {
    // Arrange
    state.chosenPaymentMethod = 'CASH'
    state.changeFor = counterReceivedNoteMock

    // Act
    const { result } = renderHook(() =>
      useCounterPaymentSelection(['CASH'], counterSaleTotalMock)
    )

    // Assert
    expect(result.current.hasChange).toBe(true)
    expect(result.current.changeAmount).toBeCloseTo(2.1, 2)
  })

  it('refuses an amount below the sale total', () => {
    // Arrange
    state.chosenPaymentMethod = 'CASH'
    state.changeFor = counterShortAmountMock

    // Act
    const { result } = renderHook(() =>
      useCounterPaymentSelection(['CASH'], counterSaleTotalMock)
    )

    // Assert
    expect(result.current.isChangeValid).toBe(false)
    expect(result.current.changeAmount).toBe(0)
  })

  it('ignores a leftover amount when the method is not cash', () => {
    // Arrange
    state.changeFor = counterShortAmountMock

    // Act
    const { result } = renderHook(() =>
      useCounterPaymentSelection(['PIX'], counterSaleTotalMock)
    )

    // Assert
    expect(result.current.isChangeValid).toBe(true)
    expect(result.current.changeAmount).toBe(0)
    expect(result.current.hasChange).toBe(false)
  })

  it('suggests the notes that cover the sale total', () => {
    const { result } = renderHook(() =>
      useCounterPaymentSelection(['CASH'], counterSaleTotalMock)
    )
    expect(result.current.suggestedNotes).toEqual([50, 100, 200])
  })
})
