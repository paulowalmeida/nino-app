export type CreateProductRequest = {
  name: string
  description?: string
  price: number
  position?: number
  categoryId: string
  isActive?: boolean
}
