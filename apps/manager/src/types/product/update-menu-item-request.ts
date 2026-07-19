export type UpdateMenuItemRequest = {
  name: string
  description?: string
  price: number
  categoryId: string
  position: number
  isActive: boolean
}
