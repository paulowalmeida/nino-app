export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  position: number | null
  isActive: boolean
  unitId: string
  createdAt: string
  updatedAt: string
  category: { id: string; name: string }
}
