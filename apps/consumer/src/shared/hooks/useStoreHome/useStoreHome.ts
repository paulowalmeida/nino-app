import { useParams } from 'react-router'

import { useStore } from '@hooks/useStore/useStore'
import { resolveSlug } from '@utils/resolve-slug'

type StoreHome = {
  showBanner: boolean
  showSearch: boolean
  showCategoryBar: boolean
  showStoreInfo: boolean
}

const NINO_DEFAULT: StoreHome = {
  showBanner: true,
  showSearch: true,
  showCategoryBar: true,
  showStoreInfo: true,
}

/**
 * Quais blocos opcionais a loja mantém na home. Identidade e cardápio não
 * entram aqui: sem eles não há vitrine.
 */
export const useStoreHome = (): StoreHome => {
  const { slug: pathSlug } = useParams()
  const { store } = useStore(resolveSlug(pathSlug) ?? undefined)
  const home = store?.theme?.config.home

  return home ? { ...NINO_DEFAULT, ...home } : NINO_DEFAULT
}
