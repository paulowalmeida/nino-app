import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { MenuPage } from '@custom_types/menu/menu-page'
import { listMenu } from '@services/menu.service'
import { groupMenu } from '@utils/group-menu'

export const useMenu = (tenantId: string | undefined) => {
  const query = useQuery<MenuPage>({
    queryKey: queryKeys.menu.byTenant(tenantId ?? ''),
    queryFn: () => listMenu(tenantId as string),
    enabled: !!tenantId,
  })

  const sections = query.data ? groupMenu(query.data.data) : []

  return { ...query, sections }
}
