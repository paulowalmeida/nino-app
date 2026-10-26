import { groupsForMember } from '@layouts/AppLayout/utils/sidemenu-access/sidemenu-access'
import { SIDEMENU_GROUPS } from '@shared/constants/sidemenu.constants'
import type { Membership } from '@shared/types/auth/membership'

const FALLBACK_SECTION = 'visao-geral'

/**
 * Where a unit switch lands: the same section in the other unit, always at
 * the section's list — a detail id belongs to the unit being left.
 */
export const unitSwitchPath = (
  pathname: string,
  target: Pick<Membership, 'unitId' | 'role' | 'permissions'>
): string => {
  const section = pathname.split('/')[2]
  const reachable = groupsForMember(SIDEMENU_GROUPS, target).some(
    ({ items }) => items.some((item) => item.section === section)
  )

  return `/${target.unitId}/${reachable ? section : FALLBACK_SECTION}`
}
