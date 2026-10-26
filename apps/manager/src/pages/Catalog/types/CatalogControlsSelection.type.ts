export type CatalogControlsSelection = {
  isSelecting: boolean
  selectedItemCount: number
  isAllLoadedSelected: boolean
  isSomeLoadedSelected: boolean
  onStartSelection: () => void
  onToggleAllSelection: () => void
  onCancelSelection: () => void
  onRequestBulkDelete: () => void
}
