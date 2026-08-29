import { useParams } from 'react-router'

import { resolveSlug } from '@utils/resolve-slug'

export const useHomeSlug = (): string | undefined => {
  const { slug } = useParams()
  return resolveSlug(slug) ?? undefined
}
