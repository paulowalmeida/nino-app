import { useQuery } from '@tanstack/react-query'

import type { MenuPage, MenuSection } from '@custom_types/product'
import { listMenu } from '@services/product/product.service'

export const menuQueryKey = (tenantId: string | null) => ['menu', tenantId]

/**
 * Groups by category in the order the items arrive: the API already sorts by
 * `position`, so the first appearance of a category is its place on the menu.
 * Avoids a second read from `/product-categories`, which only OWNER can do.
 */
const toSections = (page: MenuPage | undefined): MenuSection[] => {
  const sections: MenuSection[] = []

  for (const item of page?.data ?? []) {
    const existing = sections.find(({ id }) => id === item.category.id)
    if (existing) existing.items.push(item)
    else
      sections.push({
        id: item.category.id,
        name: item.category.name,
        items: [item],
      })
  }

  return sections
}

export const useMenu = (tenantId: string | null) => {
  const query = useQuery<MenuPage>({
    queryKey: menuQueryKey(tenantId),
    queryFn: () => listMenu(tenantId as string),
    enabled: !!tenantId,
  })

  return { ...query, sections: toSections(query.data) }
}
