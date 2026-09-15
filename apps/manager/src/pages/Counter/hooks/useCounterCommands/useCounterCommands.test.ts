import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCounterCommands } from './useCounterCommands'

const spies = vi.hoisted(() => ({
  channel: 'COUNTER',
  clear: vi.fn(),
  reset: vi.fn(),
  step: vi.fn(),
  sell: vi.fn(),
  setSheet: vi.fn(),
  setLastSale: vi.fn(),
}))

vi.mock(
  '@pages/Counter/hooks/useCounterDeliveryQuote/useCounterDeliveryQuote',
  () => ({
    useCounterDeliveryQuote: () => ({ quote: { id: 'quoted-zone', fee: 3 } }),
  })
)

vi.mock('@pages/Counter/hooks/useCounterCart/useCounterCart', () => ({
  useCounterCart: () => ({
    lines: [{ productId: 'item-1', quantity: 1 }],
    total: 20,
    updateQuantity: spies.step,
  }),
}))
vi.mock(
  '@pages/Counter/hooks/useCounterAvailability/useCounterAvailability',
  () => ({
    useCounterAvailability: () => ({ fee: 0, zones: [] }),
  })
)
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
      consumerName: 'Ana',
      tableNumber: '',
      changeFor: '50,00',
      channel: spies.channel,
      recipient: { name: 'Ana', zipCode: '67143450', zoneId: 'stale-zone' },
    }),
}))
vi.mock('@nino/ds/components/Toast', () => ({
  toast: { success: vi.fn() },
}))

describe(useCounterCommands.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    spies.channel = 'COUNTER'
  })

  it('sends the current quoted zone instead of the previous recipient zone', async () => {
    spies.channel = 'DELIVERY'
    spies.sell.mockResolvedValue(null)
    const { result } = renderHook(() => useCounterCommands('unit-1', 'PIX'))

    await act(() => result.current.finish())

    expect(spies.sell).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient: expect.objectContaining({ zoneId: 'quoted-zone' }),
      })
    )
  })

  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: new QueryClient() }, children)

  it('closes the sheet when the last line is removed', () => {
    const { result } = renderHook(
      () => useCounterCommands('unit-1', 'CASH'),
      { wrapper }
    )
    act(() => result.current.handleStep('item-1', -1))
    expect(spies.setSheet).toHaveBeenCalledWith(false)
    expect(spies.step).toHaveBeenCalledWith('item-1', -1)
  })

  it('keeps the sheet open when stepping a non-final line', () => {
    spies.setSheet.mockClear()
    const { result } = renderHook(
      () => useCounterCommands('unit-1', 'CASH'),
      { wrapper }
    )
    act(() => result.current.handleStep('other-item', 1))
    expect(spies.setSheet).not.toHaveBeenCalled()
  })

  it('clears the ticket after a successful sale', async () => {
    spies.sell.mockResolvedValue({ orderNumber: 7 })
    const { result } = renderHook(
      () => useCounterCommands('unit-1', 'CASH'),
      { wrapper }
    )
    await act(() => result.current.finish())
    expect(spies.clear).toHaveBeenCalled()
    expect(spies.reset).toHaveBeenCalled()
  })

  it('captures the sale as a receipt before clearing the ticket', async () => {
    // Arrange
    spies.sell.mockResolvedValue({ orderNumber: 128, pickupCode: '123456' })
    const { result } = renderHook(
      () => useCounterCommands('unit-1', 'CASH'),
      { wrapper }
    )

    // Act
    await act(() => result.current.finish())

    // Assert
    expect(spies.setLastSale).toHaveBeenCalledWith(
      expect.objectContaining({
        orderNumber: 128,
        pickupCode: '123456',
        total: 20,
        paymentMethod: 'CASH',
        receivedAmount: 50,
        changeAmount: 30,
      })
    )
  })

  it('does not sell without a payment method', async () => {
    spies.sell.mockClear()
    const { result } = renderHook(() => useCounterCommands('unit-1', null), {
      wrapper,
    })
    await act(() => result.current.finish())
    expect(spies.sell).not.toHaveBeenCalled()
  })

  it('keeps the ticket when the sale is rejected', async () => {
    spies.sell.mockClear()
    spies.clear.mockClear()
    spies.sell.mockResolvedValue(null)
    const { result } = renderHook(
      () => useCounterCommands('unit-1', 'CASH'),
      { wrapper }
    )
    await act(() => result.current.finish())
    expect(spies.clear).not.toHaveBeenCalled()
  })
})
