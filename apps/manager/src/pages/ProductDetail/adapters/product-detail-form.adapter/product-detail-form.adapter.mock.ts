export const productDetailFormMock = {
  name: 'X-Tudo',
  description: 'Hambúrguer com queijo',
  price: '25,90',
  categoryId: 'burgers',
  position: 2,
  isActive: true,
  requiresPreparation: true,
  pricingType: 'FIXED' as const,
  modifiers: [
    {
      name: 'Primeiro sabor',
      description: '',
      role: 'COMPOSITION' as const,
      minSelections: 1,
      maxSelections: 1,
      options: [{ name: 'Queijo', price: '20,00' }],
    },
  ],
}

export const menuItemMock = {
  id: 'product-1',
  name: 'X-Tudo',
  description: null,
  price: '25.9',
  position: 2,
  isActive: true,
  requiresPreparation: true,
  pricingType: 'FIXED' as const,
  modifiers: [
    {
      id: 'modifier-1',
      name: 'Primeiro sabor',
      description: null,
      role: 'COMPOSITION' as const,
      minSelections: 1,
      maxSelections: 1,
      options: [{ id: 'option-1', name: 'Queijo', price: '20' }],
    },
  ],
  category: { id: 'burgers', name: 'Hambúrgueres', position: 1 },
  images: [],
  fallbackUrl: '/product-presets/x-tudo.png',
}
