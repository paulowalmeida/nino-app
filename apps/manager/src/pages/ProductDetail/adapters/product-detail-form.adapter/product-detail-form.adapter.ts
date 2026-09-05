import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'
import type { MenuItem } from '@shared/types/product/menu-item'
import type { ReplaceProductModifierRequest } from '@shared/types/product/replace-product-modifier-request'
import type { UpdateMenuItemRequest } from '@shared/types/product/update-menu-item-request'

type ProductDetailFormInput = {
  name: string
  description: string
  price: string
  categoryId: string
  position: number
  isActive: boolean
  requiresPreparation: boolean
  pricingType?: 'FIXED' | 'COMPOSED'
}

export const toUpdateMenuItemRequest = ({
  name,
  description,
  price,
  categoryId,
  position,
  isActive,
  requiresPreparation,
  pricingType = 'FIXED',
}: ProductDetailFormInput): UpdateMenuItemRequest => ({
  name,
  description: description || undefined,
  price:
    pricingType === 'COMPOSED'
      ? 0
      : Number(price.replace(/\./g, '').replace(',', '.')),
  categoryId,
  position: Number(position),
  isActive,
  requiresPreparation,
  pricingType,
})

export const toReplaceProductModifiersRequest = (
  modifiers: ProductDetailFormValues['modifiers']
): ReplaceProductModifierRequest[] =>
  modifiers.map((modifier) => ({
    name: modifier.name.trim(),
    description: modifier.description.trim() || undefined,
    role: modifier.role,
    minSelections: Number(modifier.minSelections),
    maxSelections: Number(modifier.maxSelections),
    options: modifier.options.map((option) => ({
      name: option.name.trim(),
      price: Number(option.price.replace(/\./g, '').replace(',', '.')),
    })),
  }))

export const toProductFormValues = (item: MenuItem) => ({
  name: item.name,
  description: item.description ?? '',
  price: Number(item.price).toFixed(2).replace('.', ','),
  categoryId: item.category.id,
  position: item.position,
  isActive: item.isActive,
  requiresPreparation: item.requiresPreparation ?? true,
  pricingType: item.pricingType ?? 'FIXED',
  modifiers: (item.modifiers ?? []).map((modifier) => ({
    name: modifier.name,
    description: modifier.description ?? '',
    role: modifier.role,
    minSelections: modifier.minSelections,
    maxSelections: modifier.maxSelections,
    options: modifier.options.map((option) => ({
      name: option.name,
      price: Number(option.price).toFixed(2).replace('.', ','),
    })),
  })),
})
