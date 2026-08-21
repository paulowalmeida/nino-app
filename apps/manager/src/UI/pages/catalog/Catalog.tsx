import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Header } from '@nino/ds/components/Header'
import { CategoryChips } from '@organisms/CategoryChips/CategoryChips'
import { CatalogToolbar } from '@organisms/CatalogToolbar/CatalogToolbar'
import { DeleteItemDialog } from '@organisms/DeleteItemDialog/DeleteItemDialog'
import { DeleteItemsDialog } from '@organisms/DeleteItemsDialog/DeleteItemsDialog'
import { MenuBoard } from '@organisms/MenuBoard/MenuBoard'
import { useCatalogBoard } from '@hooks/product/useCatalogBoard'
import { useCategories } from '@hooks/product/useCategories'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useTenantRole } from '@hooks/session/useTenantRole'
import { useDebouncedValue } from '@hooks/ui/useDebouncedValue'
import { CatalogBoardSkeleton } from '@skeletons/pages/CatalogBoardSkeleton/CatalogBoardSkeleton'
import type { MenuItem } from '@custom_types/product/menu-item'

import styles from './Catalog.module.css'
import motion from '@styles/motion.module.css'

const DESCRIPTION =
  'Desligue o que acabou — o item some do app do cliente na hora.'

export const Catalog = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const role = useTenantRole()
  const { categories, isPending: isCategoriesPending } =
    useCategories(tenantId)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [term, setTerm] = useState('')
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [itemPendingDelete, setItemPendingDelete] = useState<MenuItem | null>(
    null
  )
  const [idsPendingDelete, setIdsPendingDelete] = useState<string[]>([])
  const search = useDebouncedValue(term.trim())
  const catalogBoard = useCatalogBoard(tenantId, categoryId, search)

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

  const canReorder = !!categoryId && !search
  const isEmpty =
    !catalogBoard.isPending && !catalogBoard.isError && catalogBoard.items.length === 0

  return (
    <Flexbox className={styles.page}>
      <Header
        mb={{ mobile: 3, desktop: 4 }}
        className={styles.header}
        title="Cardápio"
        accent="Cardápio"
        description={DESCRIPTION}
      />

      <CatalogToolbar
        term={term}
        onTermChange={setTerm}
        canManageCategories={role === 'TENANT_OWNER'}
      />

      <Flexbox shrink={false} mb={3}>
        <CategoryChips
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
          isPending={isCategoriesPending}
        />
      </Flexbox>

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
            items={catalogBoard.items}
            total={catalogBoard.total}
            isFetchingNextPage={catalogBoard.isFetchingNextPage}
            isSelecting={isSelecting}
            selectedIds={selectedIds}
            canReorder={canReorder}
            loadMoreSentinelRef={catalogBoard.loadMoreSentinelRef}
            onStartSelection={() => setIsSelecting(true)}
            onToggleSelection={handleToggleSelection}
            onToggleAllSelection={handleToggleAllSelection}
            onCancelSelection={handleCancelSelection}
            onRequestDelete={setItemPendingDelete}
            onRequestBulkDelete={() =>
              setIdsPendingDelete(Array.from(selectedIds))
            }
            onAvailabilityChange={(id, isActive) =>
              catalogBoard.setAvailability({ id, isActive })
            }
            onReorder={catalogBoard.reorderItems}
          />
        )}
      </Flexbox>

      <DeleteItemDialog
        tenantId={tenantId}
        item={itemPendingDelete}
        onClose={() => setItemPendingDelete(null)}
      />

      <DeleteItemsDialog
        tenantId={tenantId}
        itemIds={idsPendingDelete}
        onClose={handleCloseDeleteItemsDialog}
      />
    </Flexbox>
  )
}
