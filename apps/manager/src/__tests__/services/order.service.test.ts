import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { OrderService, ORDER_PAGE_SIZE } = await import(
  '@services/order.service'
)

describe('OrderService', () => {
  it('getQueueSummary: reads GET tenants/:id/orders/summary', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ pending: 0 })

    // Act
    const result = await OrderService.getQueueSummary('tenant-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith(
      'tenants/tenant-1/orders/summary'
    )
    expect(result).toEqual({ pending: 0 })
  })

  it('getSalesReport: sends period when the range is a preset', async () => {
    // Arrange / Act
    await OrderService.getSalesReport('tenant-1', { period: 'today' })

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith(
      'tenants/tenant-1/orders/report',
      { period: 'today' }
    )
  })

  it('getSalesReport: sends from/to when the range is custom', async () => {
    // Arrange / Act
    await OrderService.getSalesReport('tenant-1', {
      from: '2026-08-01',
      to: '2026-08-03',
    })

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith(
      'tenants/tenant-1/orders/report',
      { from: '2026-08-01', to: '2026-08-03' }
    )
  })

  it('getSalesSeries: adds granularity to a preset range', async () => {
    // Arrange / Act
    await OrderService.getSalesSeries(
      'tenant-1',
      { period: 'week' },
      'day'
    )

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith(
      'tenants/tenant-1/orders/report/series',
      { period: 'week', granularity: 'day' }
    )
  })

  it('getSalesSeries: adds granularity to a custom range', async () => {
    // Arrange / Act
    await OrderService.getSalesSeries(
      'tenant-1',
      { from: '2026-08-01', to: '2026-08-03' },
      'day'
    )

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith(
      'tenants/tenant-1/orders/report/series',
      { from: '2026-08-01', to: '2026-08-03', granularity: 'day' }
    )
  })

  it('getSalesSeries: omits granularity when not given', async () => {
    // Arrange / Act
    await OrderService.getSalesSeries('tenant-1', { period: 'week' })

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith(
      'tenants/tenant-1/orders/report/series',
      { period: 'week' }
    )
  })

  it('getTimingReport: sends period when the range is a preset', async () => {
    // Arrange / Act
    await OrderService.getTimingReport('tenant-1', { period: 'today' })

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith(
      'tenants/tenant-1/orders/report/timing',
      { period: 'today' }
    )
  })

  it('listOrders: paginates ordered by createdAt desc, without search', async () => {
    // Arrange
    apiMock.getAll.mockResolvedValueOnce({
      data: [],
      pagination: { total: 0 },
    })

    // Act
    const result = await OrderService.listOrders('tenant-1', 1)

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith('tenants/tenant-1/orders', {
      target: 'createdAt',
      direction: 'desc',
      size: ORDER_PAGE_SIZE,
      page: 1,
    })
    expect(result).toEqual({ data: [], pagination: { total: 0 } })
  })

  it('listOrders: adds search only when given', async () => {
    // Arrange / Act
    await OrderService.listOrders('tenant-1', 1, 'Weskley')

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith('tenants/tenant-1/orders', {
      target: 'createdAt',
      direction: 'desc',
      size: ORDER_PAGE_SIZE,
      page: 1,
      search: 'Weskley',
    })
  })

  it('createOrder: creates an order under the tenant', async () => {
    // Arrange
    const data = {
      channel: 'COUNTER' as const,
      paymentMethod: 'CASH' as const,
      items: [{ productId: 'p1', quantity: 2, unitPrice: 2500 }],
    }
    apiMock.create.mockResolvedValueOnce({ id: 'order-1' })

    // Act
    const result = await OrderService.createOrder('tenant-1', data)

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith(
      'tenants/tenant-1/orders',
      data
    )
    expect(result).toEqual({ id: 'order-1' })
  })

  it('getById: reads GET tenants/:id/orders/:orderId', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ id: 'order-1' })

    // Act
    const result = await OrderService.getById('tenant-1', 'order-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith(
      'tenants/tenant-1/orders/order-1'
    )
    expect(result).toEqual({ id: 'order-1' })
  })

  it('updateOrderStatus: patches the status sub-resource of an order', async () => {
    // Arrange / Act
    await OrderService.updateOrderStatus('tenant-1', 'order-1', {
      status: 'PREPARING',
    })

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/orders',
      'order-1/status',
      { status: 'PREPARING' }
    )
  })

  it('markOrderPaid: patches the payment sub-resource as PAID', async () => {
    // Arrange / Act
    await OrderService.markOrderPaid('tenant-1', 'order-1')

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/orders',
      'order-1/payment',
      { paymentStatus: 'PAID' }
    )
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(
      OrderService.getById('tenant-1', 'order-1')
    ).rejects.toThrow('network error')
  })
})
