import type { TenantRole } from '@custom_types/auth/tenant-role'
import type { SidemenuItem } from '@custom_types/sidemenu-item.type'

export const groupsForRole = (
  groups: SidemenuItem[],
  role: TenantRole | null
): SidemenuItem[] =>
  groups.map(({ title, items }) => ({
    title,
    items: items.filter(
      ({ roles }) => !roles || (role && roles.includes(role))
    ),
  }))

export const openSectionAt = (
  groups: SidemenuItem[],
  pathname: string
): string | null =>
  groups
    .flatMap(({ items }) => items)
    .find(
      ({ children, section }) => children && pathname.includes(`/${section}`)
    )?.section ?? null
