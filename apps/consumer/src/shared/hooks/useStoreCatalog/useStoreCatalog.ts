import { useParams } from 'react-router'

import { useStore } from '@hooks/useStore/useStore'
import { resolveSlug } from '@utils/resolve-slug'

type StoreCatalog = {
  itemStyle: 'side-image' | 'big-image' | 'condensed' | 'text-only'
  imageRatio: '1:1' | '4:3' | '16:9'
  density: 'compact' | 'comfortable'
  showDescription: boolean
}

const NINO_DEFAULT: StoreCatalog = {
  itemStyle: 'side-image',
  imageRatio: '4:3',
  density: 'comfortable',
  showDescription: true,
}

/**
 * Como a loja escolheu apresentar o cardápio. Loja sem tema publicado, ou com
 * documento anterior a essa escolha, cai no padrão do nino.
 */
export const useStoreCatalog = (): StoreCatalog => {
  const { slug: pathSlug } = useParams()
  const { store } = useStore(resolveSlug(pathSlug) ?? undefined)
  const catalog = store?.theme?.config.catalog

  return catalog ? { ...NINO_DEFAULT, ...catalog } : NINO_DEFAULT
}
