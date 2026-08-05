import type { ProductCategory } from '@custom_types/product/product-category'
import { api } from '@services/http.service'

export const CategoryService = {
  listCategories: (tenantId: string): Promise<{ data: ProductCategory[] }> =>
    api.get<{ data: ProductCategory[] }>(
      `tenants/${tenantId}/product-categories`
    ),

  createCategory: (tenantId: string, name: string): Promise<ProductCategory> =>
    api.create<{ name: string }, ProductCategory>(
      `tenants/${tenantId}/product-categories`,
      { name }
    ),

  setCategoryPosition: (
    tenantId: string,
    id: string,
    position: number
  ): Promise<ProductCategory> =>
    api.patch<{ position: number }, ProductCategory>(
      `tenants/${tenantId}/product-categories`,
      id,
      { position }
    ),

  updateCategory: (
    tenantId: string,
    id: string,
    name: string
  ): Promise<ProductCategory> =>
    api.patch<{ name: string }, ProductCategory>(
      `tenants/${tenantId}/product-categories`,
      id,
      { name }
    ),

  removeCategory: (
    tenantId: string,
    id: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(
      `tenants/${tenantId}/product-categories`,
      id
    ),
}
