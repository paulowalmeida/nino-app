import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'
import { api } from '@shared/services/http/http.service'
import type { CategoryWithProductCount } from '@shared/types/product/category-with-product-count'
import type { ProductCategory } from '@shared/types/product/product-category'

export const CategoryService = {
  listCategories: (
    tenantId: string
  ): Promise<{ data: CategoryWithProductCount[] }> =>
    api.get<{ data: CategoryWithProductCount[] }>(
      `tenants/${tenantId}/product-categories/manage`
    ),

  createCategory: (
    tenantId: string,
    name: string,
    icon?: ProductCategoryIcon | null
  ): Promise<ProductCategory> =>
    api.create<
      { name: string; icon?: ProductCategoryIcon | null },
      ProductCategory
    >(`tenants/${tenantId}/product-categories`, {
      name,
      ...(icon !== undefined ? { icon } : {}),
    }),

  reorderCategories: (
    tenantId: string,
    ids: string[]
  ): Promise<{ message: string }> =>
    api.patch<{ ids: string[] }, { message: string }>(
      `tenants/${tenantId}/product-categories/reorder`,
      { ids }
    ),

  updateCategory: (
    tenantId: string,
    id: string,
    name: string,
    icon?: ProductCategoryIcon | null
  ): Promise<ProductCategory> =>
    api.patch<
      { name: string; icon?: ProductCategoryIcon | null },
      ProductCategory
    >(`tenants/${tenantId}/product-categories/${id}`, {
      name,
      ...(icon !== undefined ? { icon } : {}),
    }),

  removeCategory: (
    tenantId: string,
    id: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(
      `tenants/${tenantId}/product-categories/${id}`
    ),
}
