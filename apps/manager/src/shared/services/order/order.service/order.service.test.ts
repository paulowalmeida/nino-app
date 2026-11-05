import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { OrderService } from './order.service'
import {
  assignKitchenAssigneeRequestMock,
  createOrderRequestMock,
  customRangeParamsMock,
  deliveryQuoteResponseMock,
  orderAvailabilityMock,
  orderIdMock,
  orderMock,
  orderPageMock,
  orderQueueSummaryMock,
  periodRangeParamsMock,
  receiptBlobMock,
  salesReportMock,
  salesSeriesBreakdownMock,
  salesSeriesMock,
  timingReportMock,
  unitIdMock,
  updateOrderStatusRequestMock,
} from './order.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    getBlob: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('OrderService', () => {
  afterEach(() => vi.clearAllMocks())

  it('getDeliveryQuote: maps the transport fee and keeps only the public fields', async () => {
    vi.mocked(api.get).mockResolvedValue({
      ...deliveryQuoteResponseMock,
      internalRuleId: 'must-not-leak',
    })

    const result = await OrderService.getDeliveryQuote('unit/1', {
      latitude: -1.45,
      longitude: -48.5,
    })

    expect(api.get).toHaveBeenCalledWith(
      'orders/guest/quote?unitId=unit%2F1&latitude=-1.45&longitude=-48.5'
    )
    expect(result).toEqual({ id: 'zone-1', name: 'Centro', fee: 12.5 })
  })

  it('getAvailability: reads whether the unit accepts orders', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(orderAvailabilityMock)

    // Act
    const result = await OrderService.getAvailability(unitIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/availability`
    )
    expect(result).toBe(orderAvailabilityMock)
  })

  it('getQueueSummary: reads the pending/preparing order counts', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(orderQueueSummaryMock)

    // Act
    const result = await OrderService.getQueueSummary(unitIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`units/${unitIdMock}/orders/summary`)
    expect(result).toBe(orderQueueSummaryMock)
  })

  it('getSalesReport: queries by a named period', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(salesReportMock)

    // Act
    const result = await OrderService.getSalesReport(
      unitIdMock,
      periodRangeParamsMock
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/report`,
      { period: 'week' }
    )
    expect(result).toBe(salesReportMock)
  })

  it('getSalesReport: queries by a custom from/to range', async () => {
    // Act
    await OrderService.getSalesReport(unitIdMock, customRangeParamsMock)

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/report`,
      { from: customRangeParamsMock.from, to: customRangeParamsMock.to }
    )
  })

  it('getSalesSeries: adds granularity to the range query', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(salesSeriesMock)

    // Act
    const result = await OrderService.getSalesSeries(
      unitIdMock,
      periodRangeParamsMock,
      'day'
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/report/series`,
      { period: 'week', granularity: 'day' }
    )
    expect(result).toBe(salesSeriesMock)
  })

  it('getSalesSeriesByChannel: reads the by-channel breakdown', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(salesSeriesBreakdownMock)

    // Act
    const result = await OrderService.getSalesSeriesByChannel(
      unitIdMock,
      periodRangeParamsMock
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/report/series/by-channel`,
      { period: 'week' }
    )
    expect(result).toBe(salesSeriesBreakdownMock)
  })

  it('getSalesSeriesByPaymentMethod: reads the payment breakdown', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(salesSeriesBreakdownMock)

    // Act
    const result = await OrderService.getSalesSeriesByPaymentMethod(
      unitIdMock,
      periodRangeParamsMock
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/report/series/by-payment-method`,
      { period: 'week' }
    )
    expect(result).toBe(salesSeriesBreakdownMock)
  })

  it('getTimingReport: reads the average preparation timing', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(timingReportMock)

    // Act
    const result = await OrderService.getTimingReport(
      unitIdMock,
      periodRangeParamsMock
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/report/timing`,
      { period: 'week' }
    )
    expect(result).toBe(timingReportMock)
  })

  it('listOrders: paginates orders by recency', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(orderPageMock)

    // Act
    const result = await OrderService.listOrders(unitIdMock, 1)

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(`units/${unitIdMock}/orders`, {
      target: 'createdAt',
      direction: 'desc',
      size: 40,
      page: 1,
    })
    expect(result).toBe(orderPageMock)
  })

  it('listOrders: filters by search term and statuses when given', async () => {
    // Act
    await OrderService.listOrders(unitIdMock, 1, 'ana', [
      'PENDING',
      'PREPARING',
    ])

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(`units/${unitIdMock}/orders`, {
      target: 'createdAt',
      direction: 'desc',
      size: 40,
      page: 1,
      search: 'ana',
      status: 'PENDING,PREPARING',
    })
  })

  it('listOrders: can limit the kitchen queue to prepared items', async () => {
    await OrderService.listOrders(
      unitIdMock,
      1,
      undefined,
      ['ACCEPTED', 'PREPARING'],
      undefined,
      undefined,
      true
    )

    expect(api.getAll).toHaveBeenCalledWith(`units/${unitIdMock}/orders`, {
      target: 'createdAt',
      direction: 'desc',
      size: 40,
      page: 1,
      status: 'ACCEPTED,PREPARING',
      requiresPreparation: 'true',
    })
  })

  it('createOrder: posts a new order for the unit', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(orderMock)

    // Act
    const result = await OrderService.createOrder(
      unitIdMock,
      createOrderRequestMock
    )

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders`,
      createOrderRequestMock,
      { headers: { 'Idempotency-Key': expect.any(String) } }
    )
    expect(result).toBe(orderMock)
  })

  it('getById: reads a single order by id', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(orderMock)

    // Act
    const result = await OrderService.getById(unitIdMock, orderIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/${orderIdMock}`
    )
    expect(result).toBe(orderMock)
  })

  it('downloadReceipt: reads the receipt PDF as a blob', async () => {
    // Arrange
    vi.mocked(api.getBlob).mockResolvedValue(receiptBlobMock)

    // Act
    const result = await OrderService.downloadReceipt(unitIdMock, orderIdMock)

    // Assert
    expect(api.getBlob).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/${orderIdMock}/receipt`
    )
    expect(result).toBe(receiptBlobMock)
  })

  it('updateOrderStatus: patches the order status', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(orderMock)

    // Act
    const result = await OrderService.updateOrderStatus(
      unitIdMock,
      orderIdMock,
      updateOrderStatusRequestMock
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/${orderIdMock}/status`,
      updateOrderStatusRequestMock
    )
    expect(result).toBe(orderMock)
  })

  it('assignKitchenAssignee: assigns a staff member to the kitchen order', async () => {
    vi.mocked(api.patch).mockResolvedValue(orderMock)

    const result = await OrderService.assignKitchenAssignee(
      unitIdMock,
      orderIdMock,
      assignKitchenAssigneeRequestMock
    )

    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/${orderIdMock}/kitchen-assignee`,
      assignKitchenAssigneeRequestMock
    )
    expect(result).toBe(orderMock)
  })

  it('clearKitchenAssignee: removes the staff member from the kitchen order', async () => {
    vi.mocked(api.remove).mockResolvedValue(orderMock)

    const result = await OrderService.clearKitchenAssignee(
      unitIdMock,
      orderIdMock
    )

    expect(api.remove).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/${orderIdMock}/kitchen-assignee`
    )
    expect(result).toBe(orderMock)
  })

  it('markOrderPaid: patches the payment status to PAID', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(orderMock)

    // Act
    const result = await OrderService.markOrderPaid(unitIdMock, orderIdMock)

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/orders/${orderIdMock}/payment`,
      { paymentStatus: 'PAID' }
    )
    expect(result).toBe(orderMock)
  })
})
