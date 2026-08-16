import type {
  CategoryWithCount,
} from '@custom_types/product/category-with-count'

export const emptyCategory = {
  id: 'cat-1',
  name: 'Sobremesas',
  position: 0,
  count: 0,
} as CategoryWithCount

export const categoryWithProducts = {
  id: 'cat-2',
  name: 'Lanches',
  position: 1,
  count: 4,
} as CategoryWithCount
