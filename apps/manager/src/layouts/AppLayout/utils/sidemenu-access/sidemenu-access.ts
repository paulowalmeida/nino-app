import type { UnitRole } from '@shared/types/auth/unit-role'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

export const groupsForRole = (
  groups: SidemenuItem[],
  role: UnitRole | null
): SidemenuItem[] =>
  groups
    .map(({ title, items }) => ({
      title,
      items: items.filter(
        ({ roles }) => !roles || (role && roles.includes(role))
      ),
    }))
    .filter(({ items }) => items.length > 0)
