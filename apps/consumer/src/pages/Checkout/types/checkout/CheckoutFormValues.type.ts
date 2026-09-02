import type { OrderChannel } from '@custom_types/order/order-channel'
import type { PaymentMethod } from '@custom_types/order/payment-method'

export type CheckoutFormValues = {
  channel: OrderChannel
  deliveryZoneId?: string
  deliveryAddressId?: string
  guestName: string
  guestPhone: string
  guestZipCode?: string
  guestStreet?: string
  guestNumber?: string
  guestComplement?: string
  guestNeighborhood?: string
  guestCity?: string
  guestState?: string
  paymentMethod: PaymentMethod
  changeFor?: number
  notes?: string
}
