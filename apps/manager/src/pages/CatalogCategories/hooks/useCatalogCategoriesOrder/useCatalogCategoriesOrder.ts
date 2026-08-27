import { useCallback, useEffect } from 'react'

import type { CategoryWithCount } from '@shared/types/product/category-with-count'

export const useCatalogCategoriesOrder = (
  rows: CategoryWithCount[],
  order: CategoryWithCount[],
  setOrder: (order: CategoryWithCount[]) => void,
  reorder: (input: { ids: string[] }) => void
) => {
  const signature = rows.map(({ id }) => id).join()
  const orderSignature = order.map(({ id }) => id).join()

  useEffect(() => {
    if (signature !== orderSignature) setOrder(rows)
  }, [orderSignature, rows, setOrder, signature])

  const persistOrder = useCallback(() => {
    if (signature !== orderSignature) {
      reorder({ ids: order.map(({ id }) => id) })
    }
  }, [order, orderSignature, reorder, signature])

  return { order, setOrder, persistOrder }
}
