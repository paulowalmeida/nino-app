import { useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { StoreLookupEmptyState } from '@elements/StoreLookupEmptyState/StoreLookupEmptyState'
import { HomeContent } from '@pages/Home/components/HomeContent/HomeContent'
import { useHomeFacade } from '@pages/Home/facades/useHomeFacade/useHomeFacade'
import { StorefrontSkeleton } from '@pages/Home/skeletons/StorefrontSkeleton/StorefrontSkeleton'
import { resolveSlug } from '@utils/resolve-slug'

export const Home = () => {
  const { slug: pathSlug } = useParams()
  const slug = resolveSlug(pathSlug)
  const home = useHomeFacade(slug ?? undefined)

  if (!slug) {
    return (
      <StoreLookupEmptyState
        mascotSrc="/mascot-consumer.svg"
        title="Qual loja você procura?"
      >
        Abra pelo link da loja — cada uma tem o seu endereço.
      </StoreLookupEmptyState>
    )
  }

  if (home.isStorePending) return <StorefrontSkeleton />

  if (home.isStoreError || !home.store) {
    return (
      <StoreLookupEmptyState
        mascotSrc="/mascot-consumer-sad.svg"
        title="Loja não encontrada"
      >
        Confira o link — o endereço pode ter mudado ou a loja saiu do ar.
      </StoreLookupEmptyState>
    )
  }

  return (
    <Box>
      <HomeContent pathSlug={pathSlug ?? undefined} />
    </Box>
  )
}
