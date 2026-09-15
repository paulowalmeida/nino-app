import { useMemo } from 'react'

import { groupsForRole } from '@layouts/AppLayout/utils/sidemenu-access/sidemenu-access'
import { SIDEMENU_GROUPS } from '@shared/constants/sidemenu.constants'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

import { useUnitRole } from '../useUnitRole/useUnitRole'

type Sidemenu = {
  groups: SidemenuItem[]
}

export const useSidemenu = (): Sidemenu => {
  const role = useUnitRole()

  const groups = useMemo(() => groupsForRole(SIDEMENU_GROUPS, role), [role])

  return { groups }
}
