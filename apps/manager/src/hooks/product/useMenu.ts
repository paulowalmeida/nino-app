import { useQuery } from '@tanstack/react-query'

import type { MenuPage, MenuSection } from '@custom_types/product'
import { listMenu } from '@services/product/product.service'

export const menuQueryKey = (tenantId: string | null) => ['menu', tenantId]

/**
 * Groups by category e ordena pela `position` da própria categoria — não
 * pela ordem de chegada dos produtos, que é só a posição de cada item
 * dentro da sua categoria. Vem embutido em cada produto (`category.position`),
 * então não precisa de uma segunda leitura em `/product-categories` (que só
 * OWNER pode fazer).
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

export const useMenu = (tenantId: string | null) => {
  const query = useQuery<MenuPage>({
    queryKey: menuQueryKey(tenantId),
    queryFn: () => listMenu(tenantId as string),
    enabled: !!tenantId,
  })

  return { ...query, sections: toSections(query.data) }
}
