import type { Recipient } from '@shared/types/order/recipient'

export const currentRecipientMock: Recipient = {
  name: 'Maria',
  phone: '11988887777',
  street: 'Rua Olimpíadas',
  number: '55',
  complement: '',
  neighborhood: 'Vila Olímpia',
  zoneId: 'zone-1',
}

export const recipientPatchMock: Partial<Recipient> = {
  number: '56',
}
