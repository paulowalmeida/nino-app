export type ConsumerPaymentMethod = {
  id: string
  consumerId: string
  brand: string | null
  lastFour: string | null
  expiresAt: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
  method: { name: string; description: string | null }
}
