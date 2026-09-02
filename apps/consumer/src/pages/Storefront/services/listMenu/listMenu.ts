import type { MenuPage } from '@custom_types/menu/menu-page'
import { api } from '@shared/services/http/http.service'

/** O cardápio público da loja. `size` no teto que a API aceita (100). */
export const listMenu = async (tenantId: string): Promise<MenuPage> => {
  const data: MenuPage['data'] = []
  let page = 1
  let lastPage: MenuPage | undefined

  do {
    lastPage = await api.getAll<MenuPage>(`tenants/${tenantId}/products`, {
      size: 100,
      page,
    })
    data.push(...lastPage.data)
    page += 1
  } while (data.length < lastPage.pagination.total && lastPage.data.length > 0)

  return { ...lastPage, data }
}
