import type { NewOrderSubmissionInput } from '@pages/NewOrder/types/NewOrderSubmissionInput.type'

export const counterSubmissionMock: NewOrderSubmissionInput = {
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

export const deliverySubmissionMock: NewOrderSubmissionInput = {
  lines: [
    {
      productId: 'product-2',
      name: 'Pastel',
      unitPrice: '9.00',
      quantity: 1,
    },
  ],
  channel: 'DELIVERY',
  paymentMethod: 'PIX',
  recipient: {
    name: 'João',
    phone: '11977776666',
    street: 'Rua Olimpíadas',
    number: '55',
    complement: 'apto 22',
    neighborhood: 'Vila Olímpia',
    zoneId: 'zone-1',
  },
  notes: 'Sem cebola',
}

export const anonymousDeliverySubmissionMock: NewOrderSubmissionInput = {
  lines: [],
  channel: 'DELIVERY',
  paymentMethod: 'CASH',
  recipient: {
    name: '',
    phone: '',
    street: 'Rua Sem Nome',
    number: '',
    complement: '',
    neighborhood: '',
    zoneId: 'zone-3',
  },
  notes: '',
}
