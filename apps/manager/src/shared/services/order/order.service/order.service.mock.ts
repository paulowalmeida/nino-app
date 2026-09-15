export const unitIdMock = 'unit-1'
export const orderIdMock = 'order-1'

export const orderAvailabilityMock = { isOpen: true }

export const orderQueueSummaryMock = { pending: 2, preparing: 1 }

export const deliveryQuoteResponseMock = {
  id: 'zone-1',
  name: 'Centro',
  fee: '12.50',
}

export const periodRangeParamsMock = { period: 'week' as const }

export const customRangeParamsMock = {
  from: '2026-08-01',
  to: '2026-08-27',
}

export const salesReportMock = { total: 1000, orders: 20 }

export const salesSeriesMock = { points: [{ date: '2026-08-01', total: 100 }] }

export const salesSeriesBreakdownMock = {
  points: [{ date: '2026-08-01', breakdown: { pix: 100 } }],
}

export const timingReportMock = { averageMinutes: 25 }

export const orderPageMock = {
  data: [{ id: orderIdMock, total: 50 }],
  pagination: { total: 1 },
}

export const createOrderRequestMock = {
  channel: 'COUNTER' as const,
  paymentMethod: 'CASH' as const,
  items: [{ productId: 'product-1', quantity: 2, unitPrice: 8 }],
}

export const orderMock = { id: orderIdMock, status: 'PENDING', total: 50 }

export const updateOrderStatusRequestMock = { status: 'PREPARING' as const }

export const assignKitchenAssigneeRequestMock = {
  kitchenAssigneeId: 'staff-1',
}
