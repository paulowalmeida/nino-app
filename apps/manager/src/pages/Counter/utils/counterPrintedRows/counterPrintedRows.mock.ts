import type { Recipient } from '@shared/types/order/recipient'

export const emptyRecipientMock: Recipient = {
  name: '',
  phone: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  zoneId: '',
}

export const deliveryRecipientMock: Recipient = {
  name: 'Ana',
  phone: '(91) 98888-0000',
  street: 'Rua Ó de Almeida',
  number: '42',
  complement: 'apto 301',
  neighborhood: 'Campina',
  zoneId: 'zone-1',
}
