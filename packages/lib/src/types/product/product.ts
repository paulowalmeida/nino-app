export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  position: number | null
  isActive: boolean
  tenantId: string
  createdAt: string
  updatedAt: string
  category: { id: string; name: string }
}
