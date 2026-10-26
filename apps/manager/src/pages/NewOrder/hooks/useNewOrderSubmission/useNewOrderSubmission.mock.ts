import type { NewOrderSubmissionInput } from '@pages/NewOrder/types/NewOrderSubmissionInput.type'

export const submissionInputMock: NewOrderSubmissionInput = {
  lines: [
    {
      productId: 'product-1',
      name: 'Coxinha',
      unitPrice: '7.50',
      quantity: 2,
    },
  ],
  channel: 'COUNTER',
  paymentMethod: 'CASH',
  recipient: {
    name: 'Maria',
    phone: '11988887777',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    zoneId: '',
  },
  notes: '',
}

export const createdOrderMock = { id: 'order-1' }
