export type OrderItem = {
  id: string
  productId: string
  quantity: number
  unitPrice: string
  product: {
    id: string
    name: string
  }
}
