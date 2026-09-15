import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'
import { api } from '@shared/services/http/http.service'
import type { CategoryWithProductCount } from '@shared/types/product/category-with-product-count'
import type { ProductCategory } from '@shared/types/product/product-category'

export const CategoryService = {
  listCategories: (
    unitId: string
  ): Promise<{ data: CategoryWithProductCount[] }> =>
    api.get<{ data: CategoryWithProductCount[] }>(
      `units/${unitId}/product-categories/manage`
    ),

  createCategory: (
    unitId: string,
    name: string,
    icon?: ProductCategoryIcon | null
  ): Promise<ProductCategory> =>
    api.create<
      { name: string; icon?: ProductCategoryIcon | null },
      ProductCategory
    >(`units/${unitId}/product-categories`, {
      name,
      ...(icon !== undefined ? { icon } : {}),
    }),

  reorderCategories: (
    unitId: string,
    ids: string[]
  ): Promise<{ message: string }> =>
    api.patch<{ ids: string[] }, { message: string }>(
      `units/${unitId}/product-categories/reorder`,
      { ids }
    ),

  updateCategory: (
    unitId: string,
    id: string,
    name: string,
    icon?: ProductCategoryIcon | null
  ): Promise<ProductCategory> =>
    api.patch<
      { name: string; icon?: ProductCategoryIcon | null },
      ProductCategory
    >(`units/${unitId}/product-categories/${id}`, {
      name,
      ...(icon !== undefined ? { icon } : {}),
    }),

  removeCategory: (
    unitId: string,
    id: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(
      `units/${unitId}/product-categories/${id}`
    ),
}
