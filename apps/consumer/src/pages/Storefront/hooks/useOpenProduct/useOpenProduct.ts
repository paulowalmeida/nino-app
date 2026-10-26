import { useNavigate } from 'react-router'

import type { MenuItem } from '@custom_types/menu/menu-item'
import { useStorefrontSlug } from '@pages/Storefront/hooks/useStorefrontSlug/useStorefrontSlug'

export const useOpenProduct = () => {
  const navigate = useNavigate()
  const slug = useStorefrontSlug()
  const hrefOf = (item: MenuItem) =>
    slug ? `/${slug}/produto/${item.id}` : `/produto/${item.id}`

  return {
    openProduct: (item: MenuItem) => navigate(hrefOf(item)),
    productHref: hrefOf,
  }
}
