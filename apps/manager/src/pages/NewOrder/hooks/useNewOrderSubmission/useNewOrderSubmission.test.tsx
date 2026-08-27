import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCreateOrder } from '@shared/hooks/order/useCreateOrder/useCreateOrder'

import { useNewOrderSubmission } from './useNewOrderSubmission'
import {
  createdOrderMock,
  submissionInputMock,
} from './useNewOrderSubmission.mock'

vi.mock('@shared/hooks/order/useCreateOrder/useCreateOrder')

const mutateAsync = vi.fn()

describe('useNewOrderSubmission', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateOrder).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateOrder>)
  })

  it('returns the id of the order it opened', async () => {
    mutateAsync.mockResolvedValue(createdOrderMock)
    const { result } = renderHook(() => useNewOrderSubmission('tenant-1'))

    let orderId: string | null = null
    await act(async () => {
      orderId = await result.current.submit(submissionInputMock)
    })

    expect(orderId).toBe(createdOrderMock.id)
    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ channel: 'COUNTER', paymentMethod: 'CASH' })
    )
    expect(result.current.failed).toBe(false)
  })

  it('reports the failure instead of throwing at the caller', async () => {
    mutateAsync.mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useNewOrderSubmission('tenant-1'))

    let orderId: string | null = 'not-null'
    await act(async () => {
      orderId = await result.current.submit(submissionInputMock)
    })

    expect(orderId).toBeNull()
    expect(result.current.failed).toBe(true)
  })

  it('clears the previous failure when the attendant tries again', async () => {
    mutateAsync.mockRejectedValueOnce(new Error('offline'))
    const { result } = renderHook(() => useNewOrderSubmission('tenant-1'))

    await act(async () => {
      await result.current.submit(submissionInputMock)
    })
    expect(result.current.failed).toBe(true)

    mutateAsync.mockResolvedValue(createdOrderMock)
    await act(async () => {
      await result.current.submit(submissionInputMock)
    })

    expect(result.current.failed).toBe(false)
  })
})
