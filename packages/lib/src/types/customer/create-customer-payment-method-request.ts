export type CreateCustomerPaymentMethodRequest = {
  methodId: string
  gatewayToken: string
  brand?: string
  lastFour?: string
  expiresAt?: string
  isDefault?: boolean
}
