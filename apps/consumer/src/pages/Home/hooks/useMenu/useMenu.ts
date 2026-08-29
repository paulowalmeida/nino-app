import { useQuery } from '@tanstack/react-query'

import { menuSections } from '@pages/Home/adapters/menuSections.adapter/menuSections.adapter'
import { queryKeys } from '@constants/query-keys'
import type { MenuPage } from '@custom_types/menu/menu-page'
import { listMenu } from '@pages/Home/services/listMenu/listMenu'

export const useMenu = (tenantId: string | undefined) => {
  const query = useQuery<MenuPage>({
    queryKey: queryKeys.menu.byTenant(tenantId ?? ''),
    queryFn: () => listMenu(tenantId as string),
    enabled: !!tenantId,
  })

  const sections = query.data ? menuSections(query.data.data) : []

  return { ...query, sections }
}
