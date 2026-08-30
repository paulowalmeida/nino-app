import { useParams } from 'react-router'

import { resolveSlug } from '@utils/resolve-slug'

export const useStorefrontSlug = (): string | undefined => {
  const { slug } = useParams()
  return resolveSlug(slug) ?? undefined
}
