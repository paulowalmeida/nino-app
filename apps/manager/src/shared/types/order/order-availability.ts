import type { DeliveryCity } from '@shared/types/store/delivery-city'

import type { PaymentMethod } from './payment-method'

export type OrderAvailability = {
  acceptedPaymentMethods: PaymentMethod[]
  deliveryZones: { id: string; name: string; fee: number }[]
  storeAddress: { city: string; state: string }
  deliveryCities: DeliveryCity[]
  isPaused: boolean
  isOpen: boolean
}
