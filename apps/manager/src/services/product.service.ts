import type { CreateMenuItemRequest } from '@custom_types/product/create-menu-item-request'
import type { MenuItem } from '@custom_types/product/menu-item'
import type { MenuItemImage } from '@custom_types/product/menu-item-image'
import type { MenuPage } from '@custom_types/product/menu-page'
import type { UpdateMenuItemRequest } from '@custom_types/product/update-menu-item-request'
import { api } from '@services/http.service'

const PAGE_SIZE = 100

type MenuParams = {
  target: string
  size: number
  page: number
}

type ProductListParams = {
  page: number
  size: number
  categoryId?: string
  search?: string
}

const fetchPage = (tenantId: string, page: number): Promise<MenuPage> =>
  api.getAll<MenuParams, MenuPage>(`tenants/${tenantId}/products`, {
    target: 'position',
    size: PAGE_SIZE,
    page,
  })

export const ProductService = {
  listMenu: async (tenantId: string): Promise<MenuPage> => {
    const first = await fetchPage(tenantId, 1)
    const items = [...first.data]

    const pages = Math.ceil(first.pagination.total / PAGE_SIZE)
    for (let page = 2; page <= pages; page++) {
      const next = await fetchPage(tenantId, page)
      items.push(...next.data)
    }

    return { ...first, data: items }
  },

  listProducts: (
    tenantId: string,
    { page, size, categoryId, search }: ProductListParams
  ): Promise<MenuPage> => {
    const params: Record<string, string | number> = {
      target: 'position',
      page,
      size,
    }
    if (categoryId) params['categoryId'] = categoryId
    if (search) params['search'] = search

    return api.getAll<Record<string, string | number>, MenuPage>(
      `tenants/${tenantId}/products`,
      params
    )
  },

  createItem: (
    tenantId: string,
    data: CreateMenuItemRequest
  ): Promise<MenuItem> =>
    api.create<CreateMenuItemRequest, MenuItem>(
      `tenants/${tenantId}/products`,
      data
    ),

  setItemAvailability: (
    tenantId: string,
    id: string,
    isActive: boolean
  ): Promise<MenuItem> =>
    api.patch<{ isActive: boolean }, MenuItem>(
      `tenants/${tenantId}/products`,
      id,
      { isActive }
    ),

  setItemPosition: (
    tenantId: string,
    id: string,
    position: number
  ): Promise<MenuItem> =>
    api.patch<{ position: number }, MenuItem>(
      `tenants/${tenantId}/products`,
      id,
      { position }
    ),

  updateItem: (
    tenantId: string,
    id: string,
    data: UpdateMenuItemRequest
  ): Promise<MenuItem> =>
    api.patch<UpdateMenuItemRequest, MenuItem>(
      `tenants/${tenantId}/products`,
      id,
      data
    ),

  uploadItemImage: async (
    tenantId: string,
    productId: string,
    file: File
  ): Promise<MenuItemImage> => {
    const body = new FormData()
    body.append('file', file)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const response = await fetch(
      `${baseUrl}/tenants/${tenantId}/products/${productId}/images`,
      { method: 'POST', body, credentials: 'include' }
    )

    if (!response.ok) {
      const detail = (await response.json().catch(() => ({}))) as {
        message?: string
      }
      throw new Error(detail.message ?? 'Não foi possível enviar a imagem')
    }

    return response.json() as Promise<MenuItemImage>
  },

  removeItem: (tenantId: string, id: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`tenants/${tenantId}/products`, id),

  removeItemImage: (
    tenantId: string,
    productId: string,
    imageId: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(
      `tenants/${tenantId}/products/${productId}/images`,
      imageId
    ),
}
