import type {
  MenuItem,
  MenuItemImage,
  MenuPage,
  UpdateMenuItemRequest,
} from '@custom_types/product'
import { ApiFactory } from '@services/api/api.service'

const { getAll, patch, remove } = ApiFactory()

/** The API caps `size` at 100. */
const PAGE_SIZE = 100

type MenuParams = {
  target: string
  size: number
  page: number
}

const fetchPage = (tenantId: string, page: number): Promise<MenuPage> =>
  getAll<MenuParams, MenuPage>(`tenants/${tenantId}/products`, {
    target: 'position',
    size: PAGE_SIZE,
    page,
  })

/**
 * The menu as a single list, ordered by `position` — the order the customer
 * sees. Follows the remaining pages when the catalog is larger than one page:
 * a menu silently cut at 100 items would be worse than a slow one.
 */
export const listMenu = async (tenantId: string): Promise<MenuPage> => {
  const first = await fetchPage(tenantId, 1)
  const items = [...first.data]

  const pages = Math.ceil(first.pagination.total / PAGE_SIZE)
  for (let page = 2; page <= pages; page++) {
    const next = await fetchPage(tenantId, page)
    items.push(...next.data)
  }

  return { ...first, data: items }
}

export const setItemAvailability = (
  tenantId: string,
  id: string,
  isActive: boolean
): Promise<MenuItem> =>
  patch<{ isActive: boolean }, MenuItem>(
    `tenants/${tenantId}/products`,
    id,
    { isActive }
  )

export const updateItem = (
  tenantId: string,
  id: string,
  data: UpdateMenuItemRequest
): Promise<MenuItem> =>
  patch<UpdateMenuItemRequest, MenuItem>(
    `tenants/${tenantId}/products`,
    id,
    data
  )

/**
 * Multipart: o browser define o boundary sozinho, então o Content-Type não
 * pode ser fixado aqui — por isso o fetch direto em vez do cliente ky.
 */
export const uploadItemImage = async (
  tenantId: string,
  productId: string,
  file: File
): Promise<MenuItemImage> => {
  const body = new FormData()
  body.append('file', file)

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/tenants/${tenantId}/products/${productId}/images`,
    { method: 'POST', body, credentials: 'include' }
  )

  if (!response.ok) {
    const detail = (await response.json().catch(() => ({}))) as {
      message?: string
    }
    throw new Error(detail.message ?? 'Não foi possível enviar a imagem')
  }

  return response.json() as Promise<MenuItemImage>
}

export const removeItemImage = (
  tenantId: string,
  productId: string,
  imageId: string
): Promise<{ message: string }> =>
  remove<{ message: string }>(
    `tenants/${tenantId}/products/${productId}/images`,
    imageId
  )
