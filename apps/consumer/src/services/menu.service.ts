import type { MenuPage } from '@custom_types/menu/menu-page'
import { api } from '@services/http.service'

/** O cardápio público da loja. `size` no teto que a API aceita (100). */
export const listMenu = (tenantId: string): Promise<MenuPage> =>
  api.getWith<MenuPage>(`tenants/${tenantId}/products`, {
    size: 100,
    page: 1,
  })
