import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import type { Store } from '@custom_types/store/store'

import { isStoreOpen } from './store-open'

/** O nome que a loja escolheu mostrar, com a razão social como piso. */
export const displayName = (store: Store): string =>
  store.customName ?? store.company.name

/**
 * Dá para pedir agora? A pausa manual e o status da loja mandam primeiro —
 * uma pausa fecha mesmo dentro do expediente. Uma loja que ainda não
 * cadastrou horários não é travada por isso: sem faixa configurada, o
 * expediente não entra na conta.
 */
export const isOpen = (store: Store, hours: PublicOpeningHours[]): boolean =>
  !store.isPaused &&
  store.status.name === 'ACTIVE' &&
  (hours.length === 0 || isStoreOpen(hours, store.timezone))

/** Duas iniciais para o logo-fallback quando a loja não subiu imagem. */
export const initials = (store: Store): string =>
  displayName(store)
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
