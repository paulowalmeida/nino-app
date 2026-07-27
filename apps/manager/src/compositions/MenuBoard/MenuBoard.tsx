import { useEffect, useRef, useState } from 'react'

import { Reorder } from 'framer-motion'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { useCatalog } from '@hooks/product/useCatalog'
import { useItemAvailability } from '@hooks/product/useItemAvailability'
import { useReorderMenuItems } from '@hooks/product/useReorderMenuItems'

import { MenuRow } from './MenuRow/MenuRow'
import type { MenuBoardProps } from './MenuBoard.types'

import styles from './MenuBoard.module.css'
import motion from '@styles/motion.module.css'

export const MenuBoard = ({ tenantId, categoryId, search }: MenuBoardProps) => {
  const {
    items,
    total,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCatalog(tenantId, { categoryId, search })

  const { mutate: setAvailability } = useItemAvailability(tenantId)
  const { mutate: reorder } = useReorderMenuItems(tenantId, categoryId)

  /**
   * Arrastar só faz sentido dentro de uma categoria: a posição de um item é
   * relativa aos irmãos dela. Em "Todas" a lista atravessa categorias, e numa
   * busca ela é um recorte — mover a terceira linha de um resultado não diz
   * para onde o item deveria ir no cardápio.
   */
  const canReorder = !!categoryId && !search

  const [order, setOrder] = useState(items)
  const [prevItems, setPrevItems] = useState(items)
  const orderRef = useRef(order)

  /** Re-seeds só quando a API manda um recorte diferente do que já temos. */
  if (items !== prevItems) {
    setPrevItems(items)
    setOrder(items)
  }

  useEffect(() => {
    orderRef.current = order
  }, [order])

  /**
   * As posições são fixas (o mesmo conjunto, só reatribuído): a lista carrega
   * a categoria em ordem, então trocar duas linhas troca duas posições que já
   * existem — não inventa posição nova nem desloca o que ainda não carregou.
   */
  const persist = () => {
    const slots = items.map((item) => item.position).sort((a, b) => a - b)
    const previousPositionById = new Map(
      items.map((item) => [item.id, item.position])
    )
    const changes = orderRef.current
      .map((item, index) => ({ id: item.id, position: slots[index] }))
      .filter(({ id, position }) => previousPositionById.get(id) !== position)

    if (changes.length > 0) reorder({ positions: changes })
  }

  if (isPending) {
    return (
      <div className={styles.loading}>
        <Skeleton className={styles.skeletonRow} />
        <Skeleton className={styles.skeletonRow} />
        <Skeleton className={styles.skeletonRow} />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="error">
        Não foi possível carregar o cardápio. Recarregue a página para tentar de
        novo.
      </Alert>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState size="md" className={motion.unroll}>
        {search
          ? `Nenhum item com "${search}". Tente outro nome.`
          : 'Nada nesta categoria ainda. Cadastre o primeiro item.'}
      </EmptyState>
    )
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.tally}>
        {total === 1 ? '1 item' : `${total} itens`}
        {canReorder && ' · arraste para mudar a ordem no app do cliente'}
      </p>

      {/* a rolagem começa aqui: a contagem acima fica parada */}
      <div className={styles.scroll}>
        <Card className={styles.list}>
          <Reorder.Group
            as="ul"
            axis="y"
            values={order}
            onReorder={setOrder}
            className={styles.items}
          >
            {order.map((item, index) => (
              <MenuRow
                key={item.id}
                item={item}
                index={index}
                tenantId={tenantId}
                canReorder={canReorder}
                onToggleAvailability={(itemId, isActive) =>
                  setAvailability({ id: itemId, isActive })
                }
                onDragEnd={persist}
              />
            ))}
          </Reorder.Group>
        </Card>

        {hasNextPage && (
          <div className={styles.more}>
            <Button
              variant="outline"
              size="sm"
              loading={isFetchingNextPage}
              className={motion.press}
              onClick={() => void fetchNextPage()}
            >
              Carregar mais itens
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
