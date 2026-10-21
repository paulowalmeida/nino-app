import type { MenuItem } from '@shared/types/product/menu-item'

export const productWithPhotoMock: MenuItem = {
  id: 'item-1',
  name: 'Coxinha',
  description: null,
  price: '8.50',
  position: 1,
  isActive: true,
  category: { id: 'cat-1', name: 'Salgados', position: 0 },
  images: [{ id: 'image-1', url: '/ready-coxinha.png', isPrimary: true }],
}

export const productWithBrokenPhotoMock: MenuItem = {
  ...productWithPhotoMock,
  id: 'item-2',
  images: [{ id: 'image-2', url: '/broken-pastel.png', isPrimary: true }],
}
