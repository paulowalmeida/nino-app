import type { MenuItem } from '@shared/types/product/menu-item'
import type { UpdateMenuItemRequest } from '@shared/types/product/update-menu-item-request'

type ProductDetailFormInput = {
  name: string
  description: string
  price: string
  categoryId: string
  position: number
  isActive: boolean
  requiresPreparation: boolean
}

export const toUpdateMenuItemRequest = ({
  name,
  description,
  price,
  categoryId,
  position,
  isActive,
  requiresPreparation,
}: ProductDetailFormInput): UpdateMenuItemRequest => ({
  name,
  description: description || undefined,
  price: Number(price.replace(/\./g, '').replace(',', '.')),
  categoryId,
  position: Number(position),
  isActive,
  requiresPreparation,
})

export const toProductFormValues = (item: MenuItem) => ({
  name: item.name,
  description: item.description ?? '',
  price: Number(item.price).toFixed(2).replace('.', ','),
  categoryId: item.category.id,
  position: item.position,
  isActive: item.isActive,
  requiresPreparation: item.requiresPreparation ?? true,
})
