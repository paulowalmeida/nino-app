import { useParams } from 'react-router'

import { useStore } from '@hooks/useStore/useStore'
import { resolveSlug } from '@utils/resolve-slug'

export const useSignInBrand = () => {
  const { slug: pathSlug } = useParams()
  const { store } = useStore(resolveSlug(pathSlug) ?? undefined)

  return { home: pathSlug ? `/${pathSlug}` : '/', store }
}
