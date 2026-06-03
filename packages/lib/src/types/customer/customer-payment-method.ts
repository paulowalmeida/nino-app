export type CustomerPaymentMethod = {
  id: string
  customerId: string
  brand: string | null
  lastFour: string | null
  expiresAt: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
  method: { name: string; description: string | null }
}
