import type { MenuSection } from '@shared/types/product/menu-section'

export const findTabProductSectionsMock = [
  {
    id: 'category-1',
    name: 'Salgados',
    position: 0,
    items: [{ id: 'product-1', name: 'Pastel de queijo' }],
  },
  {
    id: 'category-2',
    name: 'Bebidas',
    position: 1,
    items: [{ id: 'product-2', name: 'Caldo de cana' }],
  },
] as unknown as MenuSection[]
