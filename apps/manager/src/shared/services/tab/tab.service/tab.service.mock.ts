export const tabServiceUnitIdMock = 'unit-1'
export const tabServiceTabIdMock = 'tab-1'
export const tabServiceItemIdMock = 'item-1'

export const tabServiceTabMock = { id: 'tab-1', label: 'Mesa 4' }

export const tabServiceTabPageMock = {
  data: [tabServiceTabMock],
  pagination: { page: 1, size: 40, total: 1 },
}

export const tabServiceCreateRequestMock = { label: 'Mesa 4' }

export const tabServiceAddItemRequestMock = {
  productId: 'product-1',
  quantity: 2,
  notes: 'sem cebola',
}

export const tabServicePayRequestMock = {
  method: 'CASH' as const,
  amountReceived: 50,
}

export const tabServiceCancelRequestMock = { cancelReason: 'cliente saiu' }
