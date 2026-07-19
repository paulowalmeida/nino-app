export type CartLine = {
  productId: string
  name: string
  unitPrice: string
  quantity: number
}

/** Quem recebe — preenchido só quando o pedido sai para entrega. */
export type Recipient = {
  name: string
  phone: string
  street: string
  number: string
  complement: string
  neighborhood: string
  zoneId: string
}
