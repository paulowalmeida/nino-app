import { vi } from 'vitest'

import type { CatalogControlsSelection } from '@pages/Catalog/types/CatalogControlsSelection.type'

export const createSelection = (
  overrides: Partial<CatalogControlsSelection> = {}
): CatalogControlsSelection => ({
  isSelecting: false,
  selectedItemCount: 0,
  isAllLoadedSelected: false,
  isSomeLoadedSelected: false,
  onStartSelection: vi.fn(),
  onToggleAllSelection: vi.fn(),
  onCancelSelection: vi.fn(),
  onRequestBulkDelete: vi.fn(),
  ...overrides,
})
