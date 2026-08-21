import type { CreateMenuItemRequest } from '@custom_types/product/create-menu-item-request'
import type { MenuItem } from '@custom_types/product/menu-item'
import type { MenuItemImage } from '@custom_types/product/menu-item-image'
import type { MenuPage } from '@custom_types/product/menu-page'
import type { UpdateMenuItemRequest } from '@custom_types/product/update-menu-item-request'
import { api } from '@services/http.service'

const PAGE_SIZE = 100

type ProductListParams = {
  page: number
  size: number
  categoryId?: string
  search?: string
}

export type CreateMenuItemWithImageResult = {
  item: MenuItem
  imageUploadFailed: boolean
}

const fetchPage = (tenantId: string, page: number): Promise<MenuPage> =>
  api.getAll<MenuPage>(`tenants/${tenantId}/products`, {
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

    return api.getAll<MenuPage>(`tenants/${tenantId}/products`, params)
  },

  createItem: (
    tenantId: string,
    data: CreateMenuItemRequest
  ): Promise<MenuItem> =>
    api.create<CreateMenuItemRequest, MenuItem>(
      `tenants/${tenantId}/products`,
      data
    ),

  createItemWithImage: async (
    tenantId: string,
    data: CreateMenuItemRequest,
    image: File | null
  ): Promise<CreateMenuItemWithImageResult> => {
    const item = await ProductService.createItem(tenantId, data)

    if (!image) return { item, imageUploadFailed: false }

    try {
      await ProductService.uploadItemImage(tenantId, item.id, image)
      return { item, imageUploadFailed: false }
    } catch {
      return { item, imageUploadFailed: true }
    }
  },

  setItemAvailability: (
    tenantId: string,
    id: string,
    isActive: boolean
  ): Promise<MenuItem> =>
    api.patch<{ isActive: boolean }, MenuItem>(
      `tenants/${tenantId}/products/${id}`,
      { isActive }
    ),

  setItemPosition: (
    tenantId: string,
    id: string,
    position: number
  ): Promise<MenuItem> =>
    api.patch<{ position: number }, MenuItem>(
      `tenants/${tenantId}/products/${id}`,
      { position }
    ),

  updateItem: (
    tenantId: string,
    id: string,
    data: UpdateMenuItemRequest
  ): Promise<MenuItem> =>
    api.patch<UpdateMenuItemRequest, MenuItem>(
      `tenants/${tenantId}/products/${id}`,
      data
    ),

  uploadItemImage: async (
    tenantId: string,
    productId: string,
    file: File
  ): Promise<MenuItemImage> => {
    const body = new FormData()
    body.append('file', file)

    return api.createFormData<MenuItemImage>(
      `tenants/${tenantId}/products/${productId}/images`,
      body
    )
  },

  removeItem: (tenantId: string, id: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`tenants/${tenantId}/products/${id}`),

  removeItemImage: (
    tenantId: string,
    productId: string,
    imageId: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(
      `tenants/${tenantId}/products/${productId}/images/${imageId}`
    ),
}
