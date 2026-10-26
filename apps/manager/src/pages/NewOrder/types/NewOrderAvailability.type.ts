import type { PaymentMethod } from '@shared/types/order/payment-method'

export type NewOrderAvailability = {
  methods: PaymentMethod[]
  method: PaymentMethod
  zoneOptions: { value: string; label: string }[]
  fee: number
  isPaused: boolean
  closedNow: boolean
  missingRecipient: boolean
}
