import { useMemo } from 'react'

import { groupsForMember } from '@layouts/AppLayout/utils/sidemenu-access/sidemenu-access'
import { SIDEMENU_GROUPS } from '@shared/constants/sidemenu.constants'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

type Sidemenu = {
  groups: SidemenuItem[]
}

export const useSidemenu = (): Sidemenu => {
  const currentUnit = useCurrentUnit()

  const groups = useMemo(
    () => groupsForMember(SIDEMENU_GROUPS, currentUnit),
    [currentUnit]
  )

  return { groups }
}
