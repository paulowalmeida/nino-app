import { describe, expect, it } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'
import {
  toCatalogCategories,
  toCategoryDeleteError,
  toCategoryRows,
} from '@pages/CatalogCategories/adapters/catalog-categories.adapter/catalog-categories.adapter'
import {
  CATEGORIES_GENERIC_DELETE_ERROR,
  CATEGORIES_HAS_PRODUCTS_HINT,
} from '@pages/CatalogCategories/constants/catalog-categories.constants'
import type { CategoryWithProductCount } from '@shared/types/product/category-with-product-count'

const categories = [
  { id: 'desserts', name: 'Sobremesas', position: 20, productCount: 1 },
  { id: 'drinks', name: 'Bebidas', position: 10, productCount: 2 },
] as CategoryWithProductCount[]

describe('catalog categories adapters', () => {
  it('normalizes absent categories and sorts persisted categories by position', () => {
    expect(toCatalogCategories(undefined)).toEqual([])
    expect(
      toCatalogCategories({ data: categories }).map(({ id }) => id)
    ).toEqual(['drinks', 'desserts'])
  })

  it('maps backend counts without mutating source order', () => {
    const rows = toCategoryRows(categories)

    expect(rows.map(({ id, count }) => [id, count])).toEqual([
      ['drinks', 2],
      ['desserts', 1],
    ])
    expect(categories.map(({ id }) => id)).toEqual(['desserts', 'drinks'])
  })

  it('translates constrained and generic deletion failures', () => {
    expect(toCategoryDeleteError(new ApiError(400, 'has products'))).toBe(
      CATEGORIES_HAS_PRODUCTS_HINT
    )
    expect(toCategoryDeleteError(new ApiError(500, 'offline'))).toBe(
      CATEGORIES_GENERIC_DELETE_ERROR
    )
    expect(toCategoryDeleteError(new Error('unknown'))).toBe(
      CATEGORIES_GENERIC_DELETE_ERROR
    )
  })
})
