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

  createCategory: (tenantId: string, name: string): Promise<ProductCategory> =>
    api.create<{ name: string }, ProductCategory>(
      `tenants/${tenantId}/product-categories`,
      { name }
    ),

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
    name: string
  ): Promise<ProductCategory> =>
    api.patch<{ name: string }, ProductCategory>(
      `tenants/${tenantId}/product-categories/${id}`,
      { name }
    ),

  removeCategory: (
    tenantId: string,
    id: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(
      `tenants/${tenantId}/product-categories/${id}`
    ),
}
