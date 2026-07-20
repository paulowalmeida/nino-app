import type { Store } from '@custom_types/store/store'

/** O nome que a loja escolheu mostrar, com a razão social como piso. */
export const displayName = (store: Store): string =>
  store.customName ?? store.company.name

export const shortAddress = (store: Store): string =>
  `${store.neighborhood}, ${store.city}`

/**
 * Dá para pedir agora? Sem os horários de funcionamento aqui, a leitura é a
 * pausa manual do lojista mais o status da loja. Horário de expediente entra
 * quando a vitrine consumir opening-hours.
 */
export const isOpen = (store: Store): boolean =>
  !store.isPaused && store.status.name === 'ACTIVE'

/** Duas iniciais para o logo-fallback quando a loja não subiu imagem. */
export const initials = (store: Store): string =>
  displayName(store)
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
