import type { MenuItem } from '@custom_types/menu/menu-item'

export const productSummaryMock: MenuItem = {
  id: 'product-1',
  name: 'X-Salada',
  description: 'Pão, carne, queijo e salada.',
  price: '24.9',
  pricingType: 'FIXED',
  isActive: true,
  category: {
    id: 'burgers',
    name: 'Hambúrgueres',
    position: 0,
  },
  images: [],
  fallbackUrl: null,
  modifiers: [],
}
