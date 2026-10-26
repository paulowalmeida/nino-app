import type { NewOrderDraft } from '@pages/NewOrder/types/NewOrderDraft.type'

export const placementDraftMock = {
  lines: [
    {
      productId: 'product-1',
      name: 'Coxinha',
      unitPrice: '7.50',
      quantity: 2,
    },
  ],
  channel: 'COUNTER',
  chosenMethod: null,
  notes: 'Sem cebola',
  subtotal: 15,
  recipient: {
    name: 'Maria',
    phone: '11988887777',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    zoneId: '',
  },
} as unknown as NewOrderDraft

export const placedOrderIdMock = 'order-1'
