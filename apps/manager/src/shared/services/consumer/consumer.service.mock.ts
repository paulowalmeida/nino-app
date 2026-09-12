export const tenantIdMock = 'tenant-1'
export const consumerIdMock = 'consumer-1'

export const consumerPageMock = {
  data: [{ id: consumerIdMock, name: 'Cliente Fiel' }],
  pagination: { total: 1 },
}

export const consumerHistoryPageMock = {
  data: [{ id: 'order-1', total: 42 }],
  pagination: { total: 1 },
}

export const consumerHistoryMock = {
  id: consumerIdMock,
  name: 'Cliente Fiel',
}

export const topConsumerMetricMock = 'spent'

export const topConsumersMock = [
  { id: consumerIdMock, name: 'Cliente Fiel', total: 500 },
]
