import type { Recipient } from '@shared/types/order/recipient'

export const deliveryLocationRecipientMock = {
  name: 'Ana',
  phone: '91988880000',
  providerId: 'place-1',
  zipCode: '67133-100',
  street: 'Rua We 26',
  number: '471',
  complement: '',
  neighborhood: 'Coqueiro',
  city: 'Ananindeua',
  state: 'PA',
  latitude: -1.363783,
  longitude: -48.4010281,
  zoneId: 'zone-1',
} satisfies Recipient
