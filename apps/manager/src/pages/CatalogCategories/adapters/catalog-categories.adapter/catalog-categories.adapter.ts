import { ApiError } from '@nino/lib/utils/api-error'
import {
  CATEGORIES_GENERIC_DELETE_ERROR,
  CATEGORIES_HAS_PRODUCTS_HINT,
} from '@pages/CatalogCategories/constants/catalog-categories.constants'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'
import type { CategoryWithProductCount } from '@shared/types/product/category-with-product-count'

export const toCatalogCategories = (
  data: { data: CategoryWithProductCount[] } | undefined
): CategoryWithProductCount[] =>
  [...(data?.data ?? [])].sort((a, b) => a.position - b.position)

export const toCategoryRows = (
  categories: CategoryWithProductCount[]
): CategoryWithCount[] => {
  return [...categories]
    .sort((a, b) => a.position - b.position)
    .map((category) => ({
      ...category,
      count: category.productCount,
    }))
}

export const toCategoryDeleteError = (error: unknown) =>
  error instanceof ApiError && error.status === 400
    ? CATEGORIES_HAS_PRODUCTS_HINT
    : CATEGORIES_GENERIC_DELETE_ERROR
