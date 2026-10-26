import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { orderService } from '@shared/services/order/order.service'
import { usePlaceOrder } from './usePlaceOrder'
import { usePlaceOrderMock } from './usePlaceOrder.mock'

vi.mock('@shared/services/order/order.service')

let mutationFn: ((input: typeof usePlaceOrderMock.input) => unknown) | undefined

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useMutation: (options: { mutationFn: typeof mutationFn }) => {
      mutationFn = options.mutationFn
      return { mutate: vi.fn() }
    },
  }
})

describe('usePlaceOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'checkout-key-1') })
  })

  it('creates a consumer-owned order with an idempotency key', () => {
    renderHook(() => usePlaceOrder(true))

    mutationFn?.(usePlaceOrderMock.input)

    expect(orderService.createMine).toHaveBeenCalledWith(
      expect.any(Object),
      'checkout-key-1'
    )
    expect(orderService.createGuest).not.toHaveBeenCalled()
  })

  it('creates a guest order with an idempotency key', () => {
    renderHook(() => usePlaceOrder(false))

    mutationFn?.(usePlaceOrderMock.input)

    expect(orderService.createGuest).toHaveBeenCalledWith(
      expect.any(Object),
      'checkout-key-1'
    )
    expect(orderService.createMine).not.toHaveBeenCalled()
  })

  it('reuses the same key when the customer retries the same checkout', () => {
    renderHook(() => usePlaceOrder(false))

    mutationFn?.(usePlaceOrderMock.input)
    mutationFn?.(usePlaceOrderMock.input)

    expect(orderService.createGuest).toHaveBeenNthCalledWith(
      1,
      expect.any(Object),
      'checkout-key-1'
    )
    expect(orderService.createGuest).toHaveBeenNthCalledWith(
      2,
      expect.any(Object),
      'checkout-key-1'
    )
    expect(globalThis.crypto.randomUUID).toHaveBeenCalledOnce()
  })
})
