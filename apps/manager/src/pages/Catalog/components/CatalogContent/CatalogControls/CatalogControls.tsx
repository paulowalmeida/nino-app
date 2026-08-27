import { Box } from '@nino/ds/components/Box'
import { CatalogTally } from '@pages/Catalog/components/CatalogContent/CatalogControls/CatalogTally/CatalogTally'
import { MenuBoardSelectionActions } from '@pages/Catalog/components/CatalogContent/CatalogControls/MenuBoardSelectionActions/MenuBoardSelectionActions'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'
import type { CatalogControlsSelection } from '@pages/Catalog/types/CatalogControlsSelection.type'
import { canReorderCatalog } from '@pages/Catalog/utils/catalog-rules'
import type { MenuItem } from '@shared/types/product/menu-item'

import styles from '@pages/Catalog/components/CatalogContent/CatalogControls/CatalogControls.module.css'

export const CatalogControls = () => {
  const {
    total,
    categoryId,
    search,
    items,
    isSelecting,
    selectedIds,
    startSelection,
    cancelSelection,
    toggleAllItemsSelection,
    requestDeleteItems,
    tenantRole,
  } = useCatalogFacade()

  const canManageCatalog =
    tenantRole === 'TENANT_OWNER' || tenantRole === 'MANAGER'
  const canReorder = canManageCatalog && canReorderCatalog(categoryId, search)
  const selectedItemCount = selectedIds.size
  const isAllLoadedSelected =
    items.length > 0 &&
    items.every((item: MenuItem) => selectedIds.has(item.id))
  const isSomeLoadedSelected = selectedItemCount > 0 && !isAllLoadedSelected

  const selection: CatalogControlsSelection = {
    isSelecting,
    selectedItemCount,
    isAllLoadedSelected,
    isSomeLoadedSelected,
    onStartSelection: startSelection,
    onToggleAllSelection: toggleAllItemsSelection,
    onCancelSelection: cancelSelection,
    onRequestBulkDelete: () => requestDeleteItems(Array.from(selectedIds)),
  }

  return (
    <Box
      direction="row"
      align="center"
      gap={2}
      shrink={false}
      className={styles.toolbar}
    >
      {canManageCatalog && <MenuBoardSelectionActions selection={selection} />}

      <CatalogTally
        isSelecting={isSelecting}
        selectedItemCount={selectedItemCount}
        total={total}
        canReorder={canReorder}
      />
    </Box>
  )
}
