import { useMemo, useState } from 'react'
import { useLocation } from 'react-router'

import { groupsForRole, openSectionAt } from '@layouts/AppLayout/utils/sidemenu-access'
import { SIDEMENU_GROUPS } from '@shared/constants/sidemenu.constants'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

import { useTenantRole } from '../useTenantRole/useTenantRole'

type Sidemenu = {
  groups: SidemenuItem[]
  openSection: string | null
  setOpenSection: (section: string | null) => void
  isInside: (section: string) => boolean
}

export const useSidemenu = (): Sidemenu => {
  const role = useTenantRole()
  const { pathname } = useLocation()

  const groups = useMemo(
    () => groupsForRole(SIDEMENU_GROUPS, role),
    [role]
  )

  const [openSection, setOpenSection] = useState<string | null>(() =>
    openSectionAt(SIDEMENU_GROUPS, pathname)
  )

  return {
    groups,
    openSection,
    setOpenSection,
    isInside: (section) => pathname.includes(`/${section}`),
  }
}
