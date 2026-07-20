/** O cliente na visão da loja: quem é e o que já rendeu ali. */
export type TenantCustomer = {
  id: string
  name: string
  phone: string
  email: string | null
  loyaltyPoints: number
  since: string
  orders: number
  spent: number
  lastOrderAt: string | null
}
