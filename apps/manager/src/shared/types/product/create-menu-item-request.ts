export type CreateMenuItemRequest = {
  name: string
  description?: string
  price: number
  categoryId: string
  requiresPreparation?: boolean
}
