import type { Recipient } from '@shared/types/order/recipient'

export const recipientMock: Recipient = {
  name: 'Maria',
  phone: '11988887777',
  street: 'Rua Olimpíadas',
  number: '55',
  complement: '',
  neighborhood: 'Vila Olímpia',
  zoneId: 'zone-1',
}

export const deliveryZonesMock = [
  { value: 'zone-1', label: 'Centro · R$ 5,00' },
  { value: 'zone-2', label: 'Zona Sul · R$ 12,00' },
]
