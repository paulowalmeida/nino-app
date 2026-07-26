import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { MenuPage } from '@custom_types/product'
import { setCategoryPosition } from '@services/product/product.service'

import { menuQueryKey } from './useMenu'

type Variables = {
  positions: { id: string; position: number }[]
}

/**
 * Optimistic, como useReorderMenuItems: a categoria não tem cache próprio
 * (useMenu monta as seções a partir de `product.category.position`), então
 * reordenar precisa atualizar essa posição em todo item da categoria movida
 * pra useMenu reordenar as seções na hora.
 */
export const useReorderCategories = (tenantId: string | null) => {
  const queryClient = useQueryClient()
  const key = menuQueryKey(tenantId)

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
      const previous = queryClient.getQueryData<MenuPage>(key)
      const nextPositionById = new Map(
        positions.map(({ id, position }) => [id, position])
      )

      queryClient.setQueryData<MenuPage>(key, (page) => {
        if (!page) return page
        return {
          ...page,
          data: page.data.map((item) => {
            const position = nextPositionById.get(item.category.id)
            return position === undefined
              ? item
              : { ...item, category: { ...item.category, position } }
          }),
        }
      })

      return { previous }
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
    },
  })
}
