import type { MenuSection } from '@custom_types/menu/menu-section'
import type { MenuItem } from '@custom_types/menu/menu-item'

const menuItemWithImageMock = {
  id: 'item-1',
  name: 'Hambúrguer',
  description: null,
  price: '25',
  isActive: true,
  category: { id: 'burgers', name: 'Hambúrgueres', position: 0 },
  images: [
    {
      id: 'image-1',
      url: 'https://cdn.nino.delivery/burger.jpg',
      isPrimary: true,
    },
  ],
  fallbackUrl: null,
  modifiers: [],
} satisfies MenuItem

export const homeContentMock = {
  pathSlug: 'loja-do-ze',
  sections: [
    { id: 'burgers', name: 'Hambúrgueres', position: 0, items: [] },
  ] as MenuSection[],
}

export const menuSectionWithImageMock: MenuSection = {
  id: 'burgers',
  name: 'Hambúrgueres',
  position: 0,
  items: [menuItemWithImageMock],
}
