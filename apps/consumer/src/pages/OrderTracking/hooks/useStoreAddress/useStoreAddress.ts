import { useParams } from 'react-router'

import { useStore } from '@hooks/useStore/useStore'
import { resolveSlug } from '@utils/resolve-slug'

/** Onde fica a loja, em uma linha — o "local de retirada" do pedido. */
export const useStoreAddress = (): string | undefined => {
  const { slug } = useParams()
  const { store } = useStore(resolveSlug(slug) ?? undefined)

  if (!store) return undefined

  return `${store.street}, ${store.number} · ${store.neighborhood}, ${store.city} - ${store.state}`
}
