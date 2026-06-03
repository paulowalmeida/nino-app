export type OrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  createdAt: string
  updatedAt: string
  product: {
    id: string
    name: string
    description: string | null
    price: number
    position: number | null
    isActive: boolean
    categoryId: string
    tenantId: string
    createdAt: string
    updatedAt: string
  }
}
