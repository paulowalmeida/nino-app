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
  beforeEach(() => vi.clearAllMocks())

  it('creates a customer-owned order when a session exists', () => {
    renderHook(() => usePlaceOrder(true))

    mutationFn?.(usePlaceOrderMock.input)

    expect(orderService.createMine).toHaveBeenCalledOnce()
    expect(orderService.createGuest).not.toHaveBeenCalled()
  })

  it('creates a guest order when there is no session', () => {
    renderHook(() => usePlaceOrder(false))

    mutationFn?.(usePlaceOrderMock.input)

    expect(orderService.createGuest).toHaveBeenCalledOnce()
    expect(orderService.createMine).not.toHaveBeenCalled()
  })
})
