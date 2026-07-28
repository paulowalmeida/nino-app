import type { Store } from '@custom_types/store/store'

export type StoreTopBarProps = {
  store: Store
  slug: string
  cartCount: number
  onCart: () => void
  /** 0 no topo da página, 1 com a transição do cabeçalho concluída. */
  progress: number
  searchable: boolean
  search: string
  onSearchChange: (value: string) => void
}
