import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { ProductCategory } from '@custom_types/product'
import { setCategoryPosition } from '@services/product/product.service'

import { menuQueryKey } from './useMenu'

type CategoryList = { data: ProductCategory[] }

type Variables = {
  positions: { id: string; position: number }[]
}

/**
 * Optimistic, como o reordenar de itens. Escreve na lista de categorias, que
 * é o que a tela de categorias desenha; o cardápio e o balcão leem a ordem de
 * `category.position` embutida em cada produto, então esses são invalidados no
 * fim — a lista de lá não está na tela enquanto se arrasta aqui.
 */
export const useReorderCategories = (tenantId: string | null) => {
  const queryClient = useQueryClient()
  const key = queryKeys.productCategories.list(tenantId ?? '')

  return useMutation({
    meta: { errorTitle: 'A ordem das categorias voltou ao que era' },

    mutationFn: ({ positions }: Variables) =>
      Promise.all(
        positions.map(({ id, position }) =>
          setCategoryPosition(tenantId as string, id, position)
        )
      ),

    onMutate: async ({ positions }: Variables) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<CategoryList>(key)
      const nextPositionById = new Map(
        positions.map(({ id, position }) => [id, position])
      )

      queryClient.setQueryData<CategoryList>(key, (cached) => {
        if (!cached) return cached
        return {
          ...cached,
          data: cached.data
            .map((category) => {
              const position = nextPositionById.get(category.id)
              return position === undefined ? category : { ...category, position }
            })
            .sort((a, b) => a.position - b.position),
        }
      })

      return { previous }
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
      void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.all(tenantId ?? ''),
      })
    },
  })
}
