import { useMemo } from 'react'

import { groupsForRole } from '@layouts/AppLayout/utils/sidemenu-access/sidemenu-access'
import { SIDEMENU_GROUPS } from '@shared/constants/sidemenu.constants'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

import { useTenantRole } from '../useTenantRole/useTenantRole'

type Sidemenu = {
  groups: SidemenuItem[]
}

export const useSidemenu = (): Sidemenu => {
  const role = useTenantRole()

  const groups = useMemo(() => groupsForRole(SIDEMENU_GROUPS, role), [role])

  return { groups }
}
