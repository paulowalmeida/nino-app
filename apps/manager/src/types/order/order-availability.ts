import type { PaymentMethod } from './payment-method'

export type OrderAvailability = {
  acceptedPaymentMethods: PaymentMethod[]
  deliveryZones: { id: string; name: string; fee: number }[]
  isPaused: boolean
  isOpen: boolean
}
