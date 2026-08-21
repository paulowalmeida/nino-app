import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { DeleteItemDialog } from '@organisms/DeleteItemDialog/DeleteItemDialog'
import { DeleteItemsDialog } from '@organisms/DeleteItemsDialog/DeleteItemsDialog'
import { MenuBoard } from '@organisms/MenuBoard/MenuBoard'
import { useCatalogBoard } from '@hooks/product/useCatalogBoard'
import { useDeleteMenuItem } from '@hooks/product/useDeleteMenuItem'
import { useDeleteMenuItems } from '@hooks/product/useDeleteMenuItems'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { CatalogBoardSkeleton } from '@skeletons/pages/CatalogBoardSkeleton/CatalogBoardSkeleton'
import type { MenuItem } from '@custom_types/product/menu-item'

import styles from './CatalogBoardContainer.module.css'
import motion from '@styles/motion.module.css'

type CatalogBoardContainerProps = {
  categoryId: string | null
  search: string
}

export const CatalogBoardContainer = ({
  categoryId,
  search,
}: CatalogBoardContainerProps) => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const catalogBoard = useCatalogBoard(tenantId, categoryId, search)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [itemPendingDelete, setItemPendingDelete] = useState<MenuItem | null>(
    null
  )
  const [idsPendingDelete, setIdsPendingDelete] = useState<string[]>([])
  const { mutateAsync: deleteItem, isPending: isDeletingItem } =
    useDeleteMenuItem(tenantId, itemPendingDelete?.id ?? '')
  const { mutateAsync: deleteItems, isPending: isDeletingItems } =
    useDeleteMenuItems(tenantId)

  const handleToggleSelection = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleToggleAllSelection = () => {
    setSelectedIds((current) =>
      current.size === catalogBoard.items.length
        ? new Set()
        : new Set(catalogBoard.items.map(({ id }) => id))
    )
  }

  const handleCancelSelection = () => {
    setIsSelecting(false)
    setSelectedIds(new Set())
  }

  const handleCloseDeleteItemsDialog = () => {
    setIdsPendingDelete([])
    handleCancelSelection()
  }

  const handleDeleteItem = async () => {
    try {
      await deleteItem()
    } finally {
      setItemPendingDelete(null)
    }
  }

  const handleDeleteItems = async () => {
    try {
      await deleteItems(idsPendingDelete)
    } finally {
      handleCloseDeleteItemsDialog()
    }
  }

  const canReorder = !!categoryId && !search
  const isEmpty =
    !catalogBoard.isPending &&
    !catalogBoard.isError &&
    catalogBoard.items.length === 0

  return (
    <>
      <Flexbox className={styles.scroller}>
        {catalogBoard.isPending && <CatalogBoardSkeleton />}

        {catalogBoard.isError && (
          <Alert variant="error">
            Não foi possível carregar o cardápio. Recarregue a página para
            tentar de novo.
          </Alert>
        )}

        {isEmpty && (
          <EmptyState size="md" className={motion.unroll}>
            {search
              ? `Nenhum item com "${search}". Tente outro nome.`
              : 'Nada nesta categoria ainda. Cadastre o primeiro item.'}
          </EmptyState>
        )}

        {!catalogBoard.isPending && !catalogBoard.isError && !isEmpty && (
          <MenuBoard
            board={{
              items: catalogBoard.items,
              total: catalogBoard.total,
              isFetchingNextPage: catalogBoard.isFetchingNextPage,
              canReorder,
              loadMoreSentinelRef: catalogBoard.loadMoreSentinelRef,
              onRequestDelete: setItemPendingDelete,
              onAvailabilityChange: (id, isActive) =>
                catalogBoard.setAvailability({ id, isActive }),
              onReorder: catalogBoard.reorderItems,
            }}
            selection={{
              isSelecting,
              selectedIds,
              onStartSelection: () => setIsSelecting(true),
              onToggleSelection: handleToggleSelection,
              onToggleAllSelection: handleToggleAllSelection,
              onCancelSelection: handleCancelSelection,
              onRequestBulkDelete: () =>
                setIdsPendingDelete(Array.from(selectedIds)),
            }}
          />
        )}
      </Flexbox>

      <DeleteItemDialog
        item={itemPendingDelete}
        isPending={isDeletingItem}
        onConfirm={handleDeleteItem}
        onClose={() => setItemPendingDelete(null)}
      />

      <DeleteItemsDialog
        itemIds={idsPendingDelete}
        isPending={isDeletingItems}
        onConfirm={handleDeleteItems}
        onClose={handleCloseDeleteItemsDialog}
      />
    </>
  )
}
