export const tenantIdMock = 'tenant-1'
export const customerIdMock = 'customer-1'

export const customerPageMock = {
  data: [{ id: customerIdMock, name: 'Cliente Fiel' }],
  pagination: { total: 1 },
}

export const customerHistoryPageMock = {
  data: [{ id: 'order-1', total: 42 }],
  pagination: { total: 1 },
}

export const customerHistoryMock = {
  id: customerIdMock,
  name: 'Cliente Fiel',
}

export const topCustomerMetricMock = 'spent'

export const topCustomersMock = [
  { id: customerIdMock, name: 'Cliente Fiel', total: 500 },
]
