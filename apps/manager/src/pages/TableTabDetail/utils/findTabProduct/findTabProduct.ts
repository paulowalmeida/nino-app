import type { MenuItem } from '@shared/types/product/menu-item'
import type { MenuSection } from '@shared/types/product/menu-section'

export const findTabProduct = (
  sections: MenuSection[],
  productId: string
): MenuItem | undefined =>
  sections.flatMap(({ items }) => items).find(({ id }) => id === productId)
