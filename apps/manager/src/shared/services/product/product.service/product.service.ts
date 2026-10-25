import { api } from '@shared/services/http/http.service'
import type { CreateMenuItemRequest } from '@shared/types/product/create-menu-item-request'
import type { MenuItem } from '@shared/types/product/menu-item'
import type { MenuItemImage } from '@shared/types/product/menu-item-image'
import type { MenuPage } from '@shared/types/product/menu-page'
import type { ReplaceProductModifierRequest } from '@shared/types/product/replace-product-modifier-request'
import type { UpdateMenuItemRequest } from '@shared/types/product/update-menu-item-request'

const PAGE_SIZE = 100

type ProductListParams = {
  page: number
  size: number
  categoryId?: string
  search?: string
  target?: 'position' | 'name' | 'category' | 'price'
  direction?: 'asc' | 'desc'
  packageEligible?: boolean
}

export type CreateMenuItemWithImageResult = {
  item: MenuItem
  imageUploadFailed: boolean
}

const fetchManagerPage = (unitId: string, page: number): Promise<MenuPage> =>
  api.getAll<MenuPage>(`units/${unitId}/products/manage`, {
    target: 'position',
    size: PAGE_SIZE,
    page,
  })

export const ProductService = {
  listMenu: async (unitId: string): Promise<MenuPage> => {
    const first = await fetchManagerPage(unitId, 1)
    const items = [...first.data]

    const pages = Math.ceil(first.pagination.total / PAGE_SIZE)
    for (let page = 2; page <= pages; page++) {
      const next = await fetchManagerPage(unitId, page)
      items.push(...next.data)
    }

    return { ...first, data: items }
  },

  listProducts: (
    unitId: string,
    {
      page,
      size,
      categoryId,
      search,
      target = 'position',
      direction,
      packageEligible,
    }: ProductListParams
  ): Promise<MenuPage> => {
    const params: Record<string, string | number> = {
      target,
      page,
      size,
    }
    if (categoryId) params['categoryId'] = categoryId
    if (search) params['search'] = search
    if (direction) params['direction'] = direction
    if (packageEligible) params['packageEligible'] = 'true'

    return api.getAll<MenuPage>(`units/${unitId}/products/manage`, params)
  },

  createItem: (
    unitId: string,
    data: CreateMenuItemRequest
  ): Promise<MenuItem> =>
    api.create<CreateMenuItemRequest, MenuItem>(
      `units/${unitId}/products`,
      data
    ),

  createItemWithImage: async (
    unitId: string,
    data: CreateMenuItemRequest,
    image: File | null
  ): Promise<CreateMenuItemWithImageResult> => {
    const item = await ProductService.createItem(unitId, data)

    if (!image) return { item, imageUploadFailed: false }

    try {
      await ProductService.uploadItemImage(unitId, item.id, image)
      return { item, imageUploadFailed: false }
    } catch {
      return { item, imageUploadFailed: true }
    }
  },

  setItemAvailability: (
    unitId: string,
    id: string,
    isActive: boolean
  ): Promise<MenuItem> =>
    api.patch<{ isActive: boolean }, MenuItem>(
      `units/${unitId}/products/${id}`,
      { isActive }
    ),

  setItemPosition: (
    unitId: string,
    id: string,
    position: number
  ): Promise<MenuItem> =>
    api.patch<{ position: number }, MenuItem>(
      `units/${unitId}/products/${id}`,
      { position }
    ),

  reorderItems: (unitId: string, ids: string[]): Promise<{ message: string }> =>
    api.patch<{ ids: string[] }, { message: string }>(
      `units/${unitId}/products/reorder`,
      { ids }
    ),

  updateItem: (
    unitId: string,
    id: string,
    data: UpdateMenuItemRequest
  ): Promise<MenuItem> =>
    api.patch<UpdateMenuItemRequest, MenuItem>(
      `units/${unitId}/products/${id}`,
      data
    ),

  replaceItemModifiers: (
    unitId: string,
    id: string,
    modifiers: ReplaceProductModifierRequest[]
  ): Promise<MenuItem> =>
    api.patch<{ modifiers: ReplaceProductModifierRequest[] }, MenuItem>(
      `units/${unitId}/products/${id}/modifiers`,
      { modifiers }
    ),

  uploadItemImage: async (
    unitId: string,
    productId: string,
    file: File
  ): Promise<MenuItemImage> => {
    const body = new FormData()
    body.append('file', file)

    return api.createFormData<MenuItemImage>(
      `units/${unitId}/products/${productId}/images`,
      body
    )
  },

  removeItem: (unitId: string, id: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`units/${unitId}/products/${id}`),

  removeItems: (
    unitId: string,
    ids: string[]
  ): Promise<{ message: string; count: number }> =>
    api.remove<{ message: string; count: number }, { ids: string[] }>(
      `units/${unitId}/products/bulk`,
      { ids }
    ),

  removeItemImage: (
    unitId: string,
    productId: string,
    imageId: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(
      `units/${unitId}/products/${productId}/images/${imageId}`
    ),
}
