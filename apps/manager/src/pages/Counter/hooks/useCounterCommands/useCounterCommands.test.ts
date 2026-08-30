import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCounterCommands } from './useCounterCommands'

const spies = vi.hoisted(() => ({
  clear: vi.fn(),
  reset: vi.fn(),
  step: vi.fn(),
  sell: vi.fn(),
  setSheet: vi.fn(),
  setLastSale: vi.fn(),
}))

vi.mock('@pages/Counter/hooks/useCounterCart/useCounterCart', () => ({
  useCounterCart: () => ({
    lines: [{ productId: 'item-1', quantity: 1 }],
    total: 20,
    step: spies.step,
  }),
}))
vi.mock('@pages/Counter/hooks/useCounterSale/useCounterSale', () => ({
  useCounterSale: () => ({
    error: null,
    isSending: false,
    sell: spies.sell,
    reset: spies.reset,
  }),
}))
vi.mock('@pages/Counter/states/counter/counter.store', () => ({
  useCounterStore: (selector: (value: object) => unknown) =>
    selector({
      clear: spies.clear,
      setSheet: spies.setSheet,
      setLastSale: spies.setLastSale,
      customerName: 'Ana',
      tableNumber: '',
      changeFor: '50,00',
    }),
}))
vi.mock('@nino/ds/components/Toast', () => ({
  toast: { success: vi.fn() },
}))

describe(useCounterCommands.name, () => {
  it('closes the sheet when the last line is removed', () => {
    const { result } = renderHook(() => useCounterCommands('tenant-1', 'CASH'))
    act(() => result.current.handleStep('item-1', -1))
    expect(spies.setSheet).toHaveBeenCalledWith(false)
    expect(spies.step).toHaveBeenCalledWith('item-1', -1)
  })

  it('keeps the sheet open when stepping a non-final line', () => {
    spies.setSheet.mockClear()
    const { result } = renderHook(() => useCounterCommands('tenant-1', 'CASH'))
    act(() => result.current.handleStep('other-item', 1))
    expect(spies.setSheet).not.toHaveBeenCalled()
  })

  it('clears the ticket after a successful sale', async () => {
    spies.sell.mockResolvedValue('order-7')
    const { result } = renderHook(() => useCounterCommands('tenant-1', 'CASH'))
    await act(() => result.current.finish())
    expect(spies.clear).toHaveBeenCalled()
    expect(spies.reset).toHaveBeenCalled()
  })

  it('captures the sale as a receipt before clearing the ticket', async () => {
    // Arrange
    spies.sell.mockResolvedValue(128)
    const { result } = renderHook(() => useCounterCommands('tenant-1', 'CASH'))

    // Act
    await act(() => result.current.finish())

    // Assert
    expect(spies.setLastSale).toHaveBeenCalledWith(
      expect.objectContaining({
        orderNumber: 128,
        total: 20,
        paymentMethod: 'CASH',
        receivedAmount: 50,
        changeAmount: 30,
      })
    )
  })

  it('does not sell without a payment method', async () => {
    spies.sell.mockClear()
    const { result } = renderHook(() => useCounterCommands('tenant-1', null))
    await act(() => result.current.finish())
    expect(spies.sell).not.toHaveBeenCalled()
  })

  it('keeps the ticket when the sale is rejected', async () => {
    spies.sell.mockClear()
    spies.clear.mockClear()
    spies.sell.mockResolvedValue(null)
    const { result } = renderHook(() => useCounterCommands('tenant-1', 'CASH'))
    await act(() => result.current.finish())
    expect(spies.clear).not.toHaveBeenCalled()
  })
})
