import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { MenuPage } from '@custom_types/product'
import { ProductService } from '@services/product.service'

import { menuQueryKey } from './useMenu'

type Variables = {
  positions: { id: string; position: number }[]
}

/**
 * Optimistic: o arraste já moveu a linha na tela, então o cache tem que
 * concordar na hora ou a lista volta ao lugar antes da resposta chegar.
 *
 * Escreve no recorte da tela de cardápio — a lista só aceita arraste com uma
 * categoria escolhida e sem busca, então a chave é sempre a mesma. O cache do
 * `useMenu` (balcão e contagens) é invalidado no fim, não remendado: lá a
 * ordem não muda nada enquanto a pessoa arrasta.
 */
export const useReorderMenuItems = (
  tenantId: string | null,
  categoryId: string | null
) => {
  const queryClient = useQueryClient()
  const key = queryKeys.products.catalog(tenantId ?? '', categoryId, '')

  return useMutation({
    meta: { errorTitle: 'A ordem dos itens voltou ao que era' },

    mutationFn: ({ positions }: Variables) =>
      Promise.all(
        positions.map(({ id, position }) =>
          ProductService.setItemPosition(tenantId as string, id, position)
        )
      ),

    onMutate: async ({ positions }: Variables) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<InfiniteData<MenuPage>>(key)
      const nextPositionById = new Map(
        positions.map(({ id, position }) => [id, position])
      )

      queryClient.setQueryData<InfiniteData<MenuPage>>(key, (cached) => {
        if (!cached) return cached

        const ordered = cached.pages
          .flatMap((page) => page.data)
          .map((item) => {
            const position = nextPositionById.get(item.id)
            return position === undefined ? item : { ...item, position }
          })
          .sort((a, b) => a.position - b.position)

        /* Repagina mantendo o tamanho de cada página: o infinite query conta
           itens carregados para saber se ainda falta buscar. */
        let cursor = 0
        const pages = cached.pages.map((page) => {
          const data = ordered.slice(cursor, cursor + page.data.length)
          cursor += page.data.length
          return { ...page, data }
        })

        return { ...cached, pages }
      })

      return { previous }
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
    },
  })
}
