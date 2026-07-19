/** Linha da comanda. `unitPrice` é o preço no momento do pedido. */
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
