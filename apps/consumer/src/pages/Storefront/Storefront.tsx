import { useOutlet, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { StoreLookupEmptyState } from '@pages/Storefront/components/StoreLookupEmptyState/StoreLookupEmptyState'
import { StorefrontContent } from '@pages/Storefront/components/StorefrontContent/StorefrontContent'
import { StorefrontSkeleton } from '@pages/Storefront/skeletons/StorefrontSkeleton/StorefrontSkeleton'
import { resolveSlug } from '@utils/resolve-slug'
import { useStorefrontFacade } from './facades/useStorefrontFacade/useStorefrontFacade'

export const Storefront = () => {
  const { slug: pathSlug, productId } = useParams()
  const slug = resolveSlug(pathSlug)
  const outlet = useOutlet()
  const home = useStorefrontFacade(slug ?? undefined)

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
      {productId && outlet ? (
        outlet
      ) : (
        <StorefrontContent pathSlug={pathSlug ?? undefined} />
      )}
    </Box>
  )
}
