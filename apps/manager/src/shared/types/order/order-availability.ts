import type { PaymentMethod } from './payment-method'
import type { DeliveryCity } from '@shared/types/store/delivery-city'

export type OrderAvailability = {
  acceptedPaymentMethods: PaymentMethod[]
  deliveryZones: { id: string; name: string; fee: number }[]
  storeAddress: { city: string; state: string }
  deliveryCities: DeliveryCity[]
  isPaused: boolean
  isOpen: boolean
}
