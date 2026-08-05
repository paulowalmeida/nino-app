import type { CategoryWithCount } from '@custom_types/product/category-with-count'
export const buildCategory = (
  overrides: Partial<CategoryWithCount>
): CategoryWithCount => ({
  id: 'cat-1',
  name: 'Bebidas',
  description: null,
  position: 0,
  tenantId: 'tenant-1',
  count: 3,
  ...overrides,
})
