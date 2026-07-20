import type { MenuPage } from '@custom_types/menu/menu-page'
import { getWith } from '@services/api/api.service'

/** O cardápio público da loja. `size` no teto que a API aceita (100). */
export const listMenu = (tenantId: string): Promise<MenuPage> =>
  getWith<MenuPage>(`tenants/${tenantId}/products`, {
    size: 100,
    page: 1,
  })
