import { useQuery } from '@tanstack/react-query'

import { menuSections } from '@pages/Storefront/adapters/menuSections.adapter/menuSections.adapter'
import { queryKeys } from '@constants/query-keys'
import type { MenuPage } from '@custom_types/menu/menu-page'
import { listMenu } from '@pages/Storefront/services/listMenu/listMenu'

export const useMenu = (unitId: string | undefined) => {
  const query = useQuery<MenuPage>({
    queryKey: queryKeys.menu.byUnit(unitId ?? ''),
    queryFn: () => listMenu(unitId as string),
    enabled: !!unitId,
  })

  const sections = query.data ? menuSections(query.data.data) : []

  return { ...query, sections }
}
