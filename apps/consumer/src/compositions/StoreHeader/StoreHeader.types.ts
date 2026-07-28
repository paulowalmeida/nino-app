import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import type { Store } from '@custom_types/store/store'

export type StoreHeaderProps = {
  store: Store
  /** Slug no caminho — vazio quando a vitrine roda em subdomínio. */
  slug: string
  hours: PublicOpeningHours[]
  /** Produção + entrega, sem frete. Ausente enquanto as settings carregam. */
  estimatedMinutes?: number
  /** Habilita a lupa de busca — some quando a loja não tem itens. */
  searchable: boolean
  search: string
  onSearchChange: (value: string) => void
}
