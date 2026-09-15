import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { NewOrderDraft } from '@pages/NewOrder/types/NewOrderDraft.type'
import { OrderService } from '@shared/services/order/order.service'

import { useNewOrderAvailability } from './useNewOrderAvailability'
import {
  availabilityResponseMock,
  counterDraftMock,
  deliveryDraftMock,
} from './useNewOrderAvailability.mock'

vi.mock('@shared/services/order/order.service', () => ({
  OrderService: { getAvailability: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

const renderAvailability = (draft: NewOrderDraft) =>
  renderHook(() => useNewOrderAvailability('unit-1', draft), { wrapper })

describe('useNewOrderAvailability', () => {
  afterEach(() => vi.clearAllMocks())

  it('hides online card from a counter order', async () => {
    vi.mocked(OrderService.getAvailability).mockResolvedValue(
      availabilityResponseMock
    )

    const { result } = renderAvailability(counterDraftMock)

    await waitFor(() => expect(result.current.methods).toHaveLength(2))
    expect(result.current.methods).toEqual(['CASH', 'PIX'])
    expect(result.current.method).toBe('CASH')
  })

  it('charges the fee of the chosen zone on a delivery', async () => {
    vi.mocked(OrderService.getAvailability).mockResolvedValue(
      availabilityResponseMock
    )

    const { result } = renderAvailability(deliveryDraftMock)

    await waitFor(() => expect(result.current.fee).toBe(12))
    expect(result.current.method).toBe('PIX')
    expect(result.current.zoneOptions[0].label).toMatch(/^Centro · R\$\s5,00$/)
    expect(result.current.missingRecipient).toBe(false)
  })

  it('charges no fee outside delivery', async () => {
    vi.mocked(OrderService.getAvailability).mockResolvedValue(
      availabilityResponseMock
    )

    const { result } = renderAvailability(counterDraftMock)

    await waitFor(() => expect(result.current.methods).toHaveLength(2))
    expect(result.current.fee).toBe(0)
    expect(result.current.missingRecipient).toBe(false)
  })

  it('demands name, phone, street, and zone to deliver', async () => {
    vi.mocked(OrderService.getAvailability).mockResolvedValue(
      availabilityResponseMock
    )

    const { result } = renderAvailability({
      ...deliveryDraftMock,
      recipient: { ...deliveryDraftMock.recipient, street: '' },
    })

    await waitFor(() => expect(result.current.missingRecipient).toBe(true))
  })

  it('falls back to cash while availability has not arrived', () => {
    const { result } = renderAvailability(counterDraftMock)

    expect(result.current.methods).toEqual(['CASH'])
    expect(result.current.method).toBe('CASH')
    expect(result.current.zoneOptions).toEqual([])
    expect(result.current.closedNow).toBe(false)
  })

  it('reports a paused or closed store', async () => {
    vi.mocked(OrderService.getAvailability).mockResolvedValue({
      ...availabilityResponseMock,
      isPaused: true,
    })

    const { result } = renderAvailability(deliveryDraftMock)

    await waitFor(() => expect(result.current.isPaused).toBe(true))
    expect(result.current.closedNow).toBe(true)
  })

  it('reports a store outside its opening hours', async () => {
    vi.mocked(OrderService.getAvailability).mockResolvedValue({
      ...availabilityResponseMock,
      isOpen: false,
    })

    const { result } = renderAvailability(deliveryDraftMock)

    await waitFor(() => expect(result.current.closedNow).toBe(true))
    expect(result.current.isPaused).toBe(false)
  })
})
