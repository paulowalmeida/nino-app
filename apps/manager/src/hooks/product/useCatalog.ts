import { useMemo } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { MenuItem, MenuPage } from '@custom_types/product'
import { listProducts } from '@services/product/product.service'

/**
 * Vinte por vez: cabe numa tela e meia de celular, que é o quanto alguém
 * percorre antes de decidir filtrar. Página maior só adia o mesmo problema.
 */
export const CATALOG_PAGE_SIZE = 20

type CatalogFilter = {
  categoryId: string | null
  search: string
}

/**
 * O cardápio do painel, sob demanda. Antes a tela varria todas as páginas de
 * 100 e montava o catálogo inteiro em memória para depois recortar no cliente
 * — com mil itens isso é um megabyte de JSON para mostrar vinte linhas.
 */
export const useCatalog = (
  tenantId: string | null,
  { categoryId, search }: CatalogFilter
) => {
  const query = useInfiniteQuery({
    queryKey: queryKeys.products.catalog(tenantId ?? '', categoryId, search),
    enabled: !!tenantId,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      listProducts(tenantId as string, {
        page: pageParam,
        size: CATALOG_PAGE_SIZE,
        categoryId: categoryId ?? undefined,
        search: search || undefined,
      }),
    getNextPageParam: (lastPage: MenuPage, pages: MenuPage[]) => {
      const loaded = pages.reduce((total, page) => total + page.data.length, 0)
      return loaded < lastPage.pagination.total ? pages.length + 1 : undefined
    },
  })

  const items: MenuItem[] = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data]
  )

  const total = query.data?.pages[0]?.pagination.total ?? 0

  return { ...query, items, total }
}
