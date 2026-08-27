import type { CatalogState } from './CatalogState.type'

export type SetCatalogState = (
  state:
    | Partial<CatalogState>
    | ((current: CatalogState) => Partial<CatalogState>)
) => void
