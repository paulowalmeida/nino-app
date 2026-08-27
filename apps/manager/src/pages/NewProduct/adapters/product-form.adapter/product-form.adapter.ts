import type { CreateMenuItemRequest } from '@shared/types/product/create-menu-item-request'

type ProductFormInput = {
  name: string
  description: string
  price: string
  categoryId: string
}

export const toCreateMenuItemRequest = ({
  name,
  description,
  price,
  categoryId,
}: ProductFormInput): CreateMenuItemRequest => ({
  name,
  description: description || undefined,
  price: Number(price.replace(/\./g, '').replace(',', '.')),
  categoryId,
})
