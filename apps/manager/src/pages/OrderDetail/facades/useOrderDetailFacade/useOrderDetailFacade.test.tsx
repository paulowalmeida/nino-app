import { MemoryRouter } from 'react-router'

import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrder } from '@pages/OrderDetail/hooks/useOrder/useOrder'
import { useOrderPayment } from '@pages/OrderDetail/hooks/useOrderPayment/useOrderPayment'
import { useOrderReceipt } from '@pages/OrderDetail/hooks/useOrderReceipt/useOrderReceipt'
import { useOrderStatus } from '@shared/hooks/order/useOrderStatus/useOrderStatus'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useOrderDetailFacade } from './useOrderDetailFacade'
import { orderDetailFacadeMock } from './useOrderDetailFacade.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@pages/OrderDetail/hooks/useOrder/useOrder')
vi.mock('@pages/OrderDetail/hooks/useOrderPayment/useOrderPayment')
vi.mock('@pages/OrderDetail/hooks/useOrderReceipt/useOrderReceipt')
vi.mock('@shared/hooks/order/useOrderStatus/useOrderStatus')

const advanceOrder = vi.fn()
const markOrderPaid = vi.fn()
const downloadReceipt = vi.fn()

const mockIntegration = (order: unknown) => {
  vi.mocked(useOrder).mockReturnValue({
    data: order,
    isPending: false,
    isError: false,
  } as unknown as ReturnType<typeof useOrder>)
  vi.mocked(useOrderStatus).mockReturnValue({
    mutate: advanceOrder,
    mutateAsync: vi.fn(),
    isPending: true,
  } as unknown as ReturnType<typeof useOrderStatus>)
  vi.mocked(useOrderPayment).mockReturnValue({
    mutate: markOrderPaid,
    isPending: false,
  } as unknown as ReturnType<typeof useOrderPayment>)
  vi.mocked(useOrderReceipt).mockReturnValue({
    downloadReceipt,
    isDownloadingReceipt: false,
  } as unknown as ReturnType<typeof useOrderReceipt>)
}

describe('useOrderDetailFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: orderDetailFacadeMock.unitId,
    } as unknown as ReturnType<typeof useCurrentUnit>)
  })

  it('composes detail data, policy, and existing commands for the UI', () => {
    mockIntegration({
      id: orderDetailFacadeMock.orderId,
      status: 'PENDING',
      channel: 'DELIVERY',
      paymentStatus: 'PENDING',
    })

    const { result } = renderHook(() => useOrderDetailFacade(), {
      wrapper: MemoryRouter,
    })

    expect(useOrder).toHaveBeenCalledWith(orderDetailFacadeMock.unitId, '')
    expect(result.current.order?.id).toBe(orderDetailFacadeMock.orderId)
    expect(result.current.advanceOrder).toBe(advanceOrder)
    expect(result.current.markOrderPaid).toBe(markOrderPaid)
    expect(result.current.isAdvancing).toBe(true)
    expect(result.current.nextStep?.target).toBe('ACCEPTED')
    expect(result.current.canAdvance).toBe(true)
    expect(result.current.canMarkPaid).toBe(true)
    expect(result.current.canCancelOrder).toBe(true)
    expect(result.current.cancelOrder).toBeTypeOf('function')
    expect(result.current.isCancelling).toBe(true)
    expect(result.current.downloadReceipt).toBe(downloadReceipt)
    expect(result.current.isDownloadingReceipt).toBe(false)
  })

  it('closes every action while the order has not arrived', () => {
    mockIntegration(undefined)

    const { result } = renderHook(() => useOrderDetailFacade(), {
      wrapper: MemoryRouter,
    })

    expect(result.current.canAdvance).toBe(false)
    expect(result.current.canMarkPaid).toBe(false)
    expect(result.current.canCancelOrder).toBe(false)
  })

  it('passes a missing unit through to integration hooks', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    mockIntegration(undefined)

    renderHook(() => useOrderDetailFacade(), { wrapper: MemoryRouter })

    expect(useOrder).toHaveBeenCalledWith(null, '')
    expect(useOrderStatus).toHaveBeenCalledWith(null)
  })
})
