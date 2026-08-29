import { useCallback, useEffect, useRef } from 'react'

import type { CategoryWithCount } from '@shared/types/product/category-with-count'

export const useCatalogCategoriesOrder = (
  rows: CategoryWithCount[],
  order: CategoryWithCount[],
  setOrder: (order: CategoryWithCount[]) => void,
  reorder: (input: { ids: string[] }) => void
) => {
  const signature = rows.map(({ id }) => id).join()
  const syncedRowsSignature = useRef<string | null>(null)

  useEffect(() => {
    const isFirstQueryResult = syncedRowsSignature.current === null
    const serverOrderChanged = syncedRowsSignature.current !== signature

    if (
      (isFirstQueryResult && order.length === 0) ||
      (!isFirstQueryResult && serverOrderChanged)
    ) {
      setOrder(rows)
    }

    syncedRowsSignature.current = signature
  }, [order.length, rows, setOrder, signature])

  const persistOrder = useCallback(
    (nextOrder = order) => {
      const nextSignature = nextOrder.map(({ id }) => id).join()

      if (signature !== nextSignature) {
        reorder({ ids: nextOrder.map(({ id }) => id) })
      }
    },
    [order, reorder, signature]
  )

  return { order, setOrder, persistOrder }
}
