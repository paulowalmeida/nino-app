export type AddTabItemRequest = {
  productId: string
  quantity: number
  notes?: string
  modifiers?: { optionId: string; quantity: number }[]
}
