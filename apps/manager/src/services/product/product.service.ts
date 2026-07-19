import type { MenuItem, MenuPage } from '@custom_types/product'
import { ApiFactory } from '@services/api/api.service'

const { getAll, patch } = ApiFactory()

/**
 * The whole menu in one read, ordered by `position` — the order the customer
 * sees. A kitchen menu is short enough that paging it would only add friction.
 */
export const listMenu = (tenantId: string): Promise<MenuPage> =>
  getAll<{ target: string; size: number }, MenuPage>(
    `tenants/${tenantId}/products`,
    { target: 'position', size: 200 }
  )

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
