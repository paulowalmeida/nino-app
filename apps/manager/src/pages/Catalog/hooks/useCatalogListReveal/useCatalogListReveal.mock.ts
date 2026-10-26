import type { MenuItem } from '@shared/types/product/menu-item'

const baseItem: MenuItem = {
  id: 'item-1',
  name: 'Coxinha',
  description: null,
  price: '8.50',
  position: 1,
  isActive: true,
  category: { id: 'cat-1', name: 'Salgados', position: 0 },
  images: [{ id: 'image-1', url: '/coxinha.png', isPrimary: true }],
}

export const revealItemsMock: MenuItem[] = [
  baseItem,
  {
    ...baseItem,
    id: 'item-2',
    name: 'Pastel',
    images: [{ id: 'image-2', url: '/pastel.png', isPrimary: true }],
  },
]

export const revealTwoPagesMock: MenuItem[] = Array.from(
  { length: 25 },
  (_, index) => ({ ...baseItem, id: `item-${index + 1}` })
)
