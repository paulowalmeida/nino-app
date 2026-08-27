import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { OrderService } from './order.service'
import {
  createOrderRequestMock,
  customRangeParamsMock,
  orderAvailabilityMock,
  orderIdMock,
  orderMock,
  orderPageMock,
  orderQueueSummaryMock,
  periodRangeParamsMock,
  salesReportMock,
  salesSeriesBreakdownMock,
  salesSeriesMock,
  tenantIdMock,
  timingReportMock,
  updateOrderStatusRequestMock,
} from './order.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('OrderService', () => {
  afterEach(() => vi.clearAllMocks())

  it('getAvailability: reads whether the tenant accepts orders', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(orderAvailabilityMock)

    // Act
    const result = await OrderService.getAvailability(tenantIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders/availability`
    )
    expect(result).toBe(orderAvailabilityMock)
  })

  it('getQueueSummary: reads the pending/preparing order counts', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(orderQueueSummaryMock)

    // Act
    const result = await OrderService.getQueueSummary(tenantIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders/summary`
    )
    expect(result).toBe(orderQueueSummaryMock)
  })

  it('getSalesReport: queries by a named period', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(salesReportMock)

    // Act
    const result = await OrderService.getSalesReport(
      tenantIdMock,
      periodRangeParamsMock
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders/report`,
      { period: 'week' }
    )
    expect(result).toBe(salesReportMock)
  })

  it('getSalesReport: queries by a custom from/to range', async () => {
    // Act
    await OrderService.getSalesReport(tenantIdMock, customRangeParamsMock)

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders/report`,
      { from: customRangeParamsMock.from, to: customRangeParamsMock.to }
    )
  })

  it('getSalesSeries: adds granularity to the range query', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(salesSeriesMock)

    // Act
    const result = await OrderService.getSalesSeries(
      tenantIdMock,
      periodRangeParamsMock,
      'day'
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders/report/series`,
      { period: 'week', granularity: 'day' }
    )
    expect(result).toBe(salesSeriesMock)
  })

  it('getSalesSeriesByChannel: reads the by-channel breakdown', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(salesSeriesBreakdownMock)

    // Act
    const result = await OrderService.getSalesSeriesByChannel(
      tenantIdMock,
      periodRangeParamsMock
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders/report/series/by-channel`,
      { period: 'week' }
    )
    expect(result).toBe(salesSeriesBreakdownMock)
  })

  it('getSalesSeriesByPaymentMethod: reads the payment breakdown', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(salesSeriesBreakdownMock)

    // Act
    const result = await OrderService.getSalesSeriesByPaymentMethod(
      tenantIdMock,
      periodRangeParamsMock
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders/report/series/by-payment-method`,
      { period: 'week' }
    )
    expect(result).toBe(salesSeriesBreakdownMock)
  })

  it('getTimingReport: reads the average preparation timing', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(timingReportMock)

    // Act
    const result = await OrderService.getTimingReport(
      tenantIdMock,
      periodRangeParamsMock
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders/report/timing`,
      { period: 'week' }
    )
    expect(result).toBe(timingReportMock)
  })

  it('listOrders: paginates orders by recency', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(orderPageMock)

    // Act
    const result = await OrderService.listOrders(tenantIdMock, 1)

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(`tenants/${tenantIdMock}/orders`, {
      target: 'createdAt',
      direction: 'desc',
      size: 40,
      page: 1,
    })
    expect(result).toBe(orderPageMock)
  })

  it('listOrders: filters by search term and statuses when given', async () => {
    // Act
    await OrderService.listOrders(tenantIdMock, 1, 'ana', [
      'PENDING',
      'PREPARING',
    ])

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(`tenants/${tenantIdMock}/orders`, {
      target: 'createdAt',
      direction: 'desc',
      size: 40,
      page: 1,
      search: 'ana',
      status: 'PENDING,PREPARING',
    })
  })

  it('createOrder: posts a new order for the tenant', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(orderMock)

    // Act
    const result = await OrderService.createOrder(
      tenantIdMock,
      createOrderRequestMock
    )

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders`,
      createOrderRequestMock
    )
    expect(result).toBe(orderMock)
  })

  it('getById: reads a single order by id', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(orderMock)

    // Act
    const result = await OrderService.getById(tenantIdMock, orderIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders/${orderIdMock}`
    )
    expect(result).toBe(orderMock)
  })

  it('updateOrderStatus: patches the order status', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(orderMock)

    // Act
    const result = await OrderService.updateOrderStatus(
      tenantIdMock,
      orderIdMock,
      updateOrderStatusRequestMock
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders/${orderIdMock}/status`,
      updateOrderStatusRequestMock
    )
    expect(result).toBe(orderMock)
  })

  it('markOrderPaid: patches the payment status to PAID', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(orderMock)

    // Act
    const result = await OrderService.markOrderPaid(
      tenantIdMock,
      orderIdMock
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/orders/${orderIdMock}/payment`,
      { paymentStatus: 'PAID' }
    )
    expect(result).toBe(orderMock)
  })
})
