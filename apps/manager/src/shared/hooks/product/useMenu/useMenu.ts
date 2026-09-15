import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { ProductService } from '@shared/services/product/product.service'
import type { MenuPage } from '@shared/types/product/menu-page'
import type { MenuSection } from '@shared/types/product/menu-section'

export const menuQueryKey = (unitId: string | null) => ['menu', unitId]

/**
 * Groups by category and sorts by the category's own `position` — not by
 * the arrival order of the products, which is just each item's position
 * within its category. It comes embedded in every product
 * (`category.position`), so there's no need for a second read from
 * `/product-categories` (which only OWNER can do).
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
        position: item.category.position,
        items: [item],
      })
  }

  return sections.sort((a, b) => a.position - b.position)
}

export const useMenu = (unitId: string | null) => {
  const query = useQuery<MenuPage>({
    queryKey: menuQueryKey(unitId),
    queryFn: () => ProductService.listMenu(unitId as string),
    enabled: !!unitId,
  })

  const sections = useMemo(() => toSections(query.data), [query.data])

  return { ...query, sections }
}
