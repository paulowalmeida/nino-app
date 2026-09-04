import type { DeliveryCity } from '@shared/types/store/delivery-city'

export const deliveryCitiesMock: DeliveryCity[] = [
  { city: 'Belém', state: 'PA' },
  { city: 'Ananindeua', state: 'PA' },
]

export const primaryDeliveryCityMock: DeliveryCity = {
  city: 'Belém',
  state: 'PA',
}
