export const unitIdMock = 'unit-1'
export const productIdMock = 'product-1'

export const menuItemMock = {
  id: productIdMock,
  name: 'Coxinha',
  price: 8,
  isActive: true,
  position: 1,
  category: { id: 'category-1', name: 'Salgados' },
}

export const menuPageMock = {
  data: [menuItemMock],
  pagination: { total: 1, page: 1, size: 100 },
}

export const menuItemImageMock = { id: 'image-1', url: '/coxinha.png' }

export const createMenuItemRequestMock = {
  name: 'Coxinha',
  price: 8,
  categoryId: 'category-1',
}

export const updateMenuItemRequestMock = {
  name: 'Coxinha Grande',
  price: 9,
  categoryId: 'category-1',
  position: 1,
  isActive: true,
}

export const replaceProductModifiersRequestMock = [
  {
    name: 'Primeiro sabor',
    role: 'COMPOSITION' as const,
    minSelections: 1,
    maxSelections: 1,
    options: [{ name: 'Queijo', price: 20 }],
  },
]

export const removeMessageMock = { message: 'Produto removido.' }

export const removeManyMessageMock = {
  message: 'Produtos removidos.',
  count: 2,
}

export const reorderIdsMock = ['product-2', 'product-1']
