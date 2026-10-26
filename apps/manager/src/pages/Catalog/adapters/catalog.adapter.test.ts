import { describe, expect, it } from 'vitest'

import {
  toCatalogCategories,
  toCatalogItems,
  toCatalogListParams,
  toCatalogTotal,
} from '@pages/Catalog/adapters/catalog.adapter'
import type { CategoryWithProductCount } from '@shared/types/product/category-with-product-count'
import type { MenuItem } from '@shared/types/product/menu-item'
import type { MenuPage } from '@shared/types/product/menu-page'

const item = { id: 'item-1' } as MenuItem
const secondItem = { id: 'item-2' } as MenuItem

const page = (data: MenuItem[], total: number): MenuPage => ({
  data,
  pagination: { total, page: 1, size: data.length },
})

describe('catalog.adapter', () => {
  it('omits empty filters from product list params', () => {
    expect(toCatalogListParams(1, 20, null, '')).toEqual({
      page: 1,
      size: 20,
    })
  })

  it('includes category and search filters when present', () => {
    expect(toCatalogListParams(2, 20, 'cat-1', 'burger')).toEqual({
      page: 2,
      size: 20,
      categoryId: 'cat-1',
      search: 'burger',
    })
  })

  it('flattens loaded pages and reads total from the last page', () => {
    const data = {
      pages: [page([item], 3), page([secondItem], 3)],
      pageParams: [1, 2],
    }

    expect(toCatalogItems(data)).toEqual([item, secondItem])
    expect(toCatalogTotal(data)).toBe(3)
  })

  it('returns safe empty values before the query has data', () => {
    expect(toCatalogItems(undefined)).toEqual([])
    expect(toCatalogTotal(undefined)).toBe(0)
  })

  it('sorts categories by their persisted position without mutating the response', () => {
    const categories = [
      { id: 'cat-2', position: 2, productCount: 1 },
      { id: 'cat-1', position: 1, productCount: 3 },
    ] as CategoryWithProductCount[]

    expect(toCatalogCategories({ data: categories })).toEqual([
      categories[1],
      categories[0],
    ])
    expect(categories.map(({ id }) => id)).toEqual(['cat-2', 'cat-1'])
  })

  it('drops categories without a product from the filter chips', () => {
    const categories = [
      { id: 'cat-1', position: 1, productCount: 2 },
      { id: 'cat-2', position: 2, productCount: 0 },
    ] as CategoryWithProductCount[]

    expect(toCatalogCategories({ data: categories })).toEqual([categories[0]])
  })
})
