import type { NewOrderDraft } from '@pages/NewOrder/types/NewOrderDraft.type'
import type { OrderAvailability } from '@shared/types/order/order-availability'

export const availabilityResponseMock: OrderAvailability = {
  acceptedPaymentMethods: ['CASH', 'PIX', 'CARD_ONLINE'],
  deliveryZones: [
    { id: 'zone-1', name: 'Centro', fee: 5 },
    { id: 'zone-2', name: 'Zona Sul', fee: 12 },
  ],
  storeAddress: { city: 'São Paulo', state: 'SP' },
  deliveryCities: [{ city: 'São Paulo', state: 'SP' }],
  isPaused: false,
  isOpen: true,
}

export const counterDraftMock = {
  lines: [],
  channel: 'COUNTER',
  chosenMethod: null,
  notes: '',
  subtotal: 0,
  recipient: {
    name: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    zoneId: '',
  },
} as unknown as NewOrderDraft

export const deliveryDraftMock = {
  lines: [],
  channel: 'DELIVERY',
  chosenMethod: 'PIX',
  notes: '',
  subtotal: 0,
  recipient: {
    name: 'Maria',
    phone: '11988887777',
    street: 'Rua Olimpíadas',
    number: '55',
    complement: '',
    neighborhood: 'Vila Olímpia',
    zoneId: 'zone-2',
  },
} as unknown as NewOrderDraft
