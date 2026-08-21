import type { CreateMenuItemRequest } from '@custom_types/product/create-menu-item-request'
import type { MenuItem } from '@custom_types/product/menu-item'
import type { UpdateMenuItemRequest } from '@custom_types/product/update-menu-item-request'

type ProductFormInput = {
  name: string
  description: string
  price: string
  categoryId: string
}

type ProductDetailFormInput = ProductFormInput & {
  position: number
  isActive: boolean
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

export const toUpdateMenuItemRequest = ({
  name,
  description,
  price,
  categoryId,
  position,
  isActive,
}: ProductDetailFormInput): UpdateMenuItemRequest => ({
  name,
  description: description || undefined,
  price: Number(price.replace(/\./g, '').replace(',', '.')),
  categoryId,
  position: Number(position),
  isActive,
})

export const toProductFormValues = (item: MenuItem) => ({
  name: item.name,
  description: item.description ?? '',
  price: Number(item.price).toFixed(2).replace('.', ','),
  categoryId: item.category.id,
  position: item.position,
  isActive: item.isActive,
})
