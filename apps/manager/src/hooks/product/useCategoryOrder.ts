import { useEffect, useRef, useState } from 'react'

import type {
  CategoryWithCount,
  MenuSection,
  ProductCategory,
} from '@custom_types/product'

import { useReorderCategories } from './useReorderCategories'

const withCounts = (
  categories: ProductCategory[],
  sections: MenuSection[]
): CategoryWithCount[] => {
  const countById = new Map(
    sections.map((section) => [section.id, section.items.length])
  )
  return [...categories]
    .sort((a, b) => a.position - b.position)
    .map((category) => ({
      ...category,
      count: countById.get(category.id) ?? 0,
    }))
}

/**
 * Estado de arraste local + persistência otimista das posições. `rows` é
 * remontado a cada render, então comparar por referência não serve: a lista
 * só é re-semeada quando a ordem que veio da API muda de fato.
 */
export const useCategoryOrder = (
  tenantId: string | null,
  categories: ProductCategory[],
  sections: MenuSection[]
) => {
  const { mutate: reorderCategories } = useReorderCategories(tenantId)

  const rows = withCounts(categories, sections)

  const [order, setOrder] = useState(rows)
  const [prevRows, setPrevRows] = useState(rows)
  const orderRef = useRef(order)

  const signature = rows.map(({ id }) => id).join()
  const prevSignature = prevRows.map(({ id }) => id).join()
  if (signature !== prevSignature) {
    setPrevRows(rows)
    setOrder(rows)
  }

  useEffect(() => {
    orderRef.current = order
  }, [order])

  /**
   * As posições são fixas — o mesmo conjunto, só reatribuído. Sem isso, duas
   * categorias podem terminar com a mesma posição e a ordem no app do cliente
   * passa a depender do desempate do banco.
   */
  const persistOrder = () => {
    const slots = rows.map(({ position }) => position).sort((a, b) => a - b)
    const previousPositionById = new Map(
      rows.map(({ id, position }) => [id, position])
    )
    const changes = orderRef.current
      .map(({ id }, index) => ({ id, position: slots[index] }))
      .filter(({ id, position }) => previousPositionById.get(id) !== position)

    if (changes.length > 0) reorderCategories({ positions: changes })
  }

  return { order, setOrder, persistOrder }
}
