import type { Membership } from '@shared/types/auth/membership'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

type MemberAccess = Pick<Membership, 'role' | 'permissions'>

const canSee = (
  { permission, ownerOnly }: SidemenuItem['items'][number],
  member: MemberAccess | null
): boolean => {
  if (ownerOnly) return member?.role === 'UNIT_OWNER'
  if (!permission) return true
  return member?.permissions.includes(permission) ?? false
}

export const groupsForMember = (
  groups: SidemenuItem[],
  member: MemberAccess | null
): SidemenuItem[] =>
  groups
    .map(({ title, items }) => ({
      title,
      items: items.filter((item) => canSee(item, member)),
    }))
    .filter(({ items }) => items.length > 0)
