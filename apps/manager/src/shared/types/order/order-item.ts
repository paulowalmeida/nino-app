export type OrderItem = {
  id: string
  productId: string
  quantity: number
  unitPrice: string
  status?: 'ACTIVE' | 'CANCELLED'
  cancelReason?: string | null
  cancelledAt?: string | null
  cancelledBy?: string | null
  isGift?: boolean
  product: {
    id: string
    name: string
    requiresPreparation?: boolean
  }
}
