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
