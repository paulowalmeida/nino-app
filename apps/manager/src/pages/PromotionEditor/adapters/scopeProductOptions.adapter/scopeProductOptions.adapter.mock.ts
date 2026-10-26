import type { MenuItem } from '@shared/types/product/menu-item'

const baseItem = {
  description: null,
  position: 0,
  price: '10.00',
  category: { id: 'burgers', name: 'Lanches', position: 0 },
  images: [],
} as unknown as MenuItem

export const scopeMenuMock: MenuItem[] = [
  { ...baseItem, id: 'x-salada', name: 'X-Salada', isActive: true },
  { ...baseItem, id: 'paused', name: 'Suco', isActive: false },
  { ...baseItem, id: 'batata', name: 'Batata frita', isActive: true },
]
