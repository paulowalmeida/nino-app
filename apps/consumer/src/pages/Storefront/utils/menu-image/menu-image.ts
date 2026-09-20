import { defaultProductImage } from '@nino/lib/utils/default-product-image'

import type { MenuItem } from '@custom_types/menu/menu-item'

/** A foto que representa o item: a marcada como principal, ou a primeira. */
export const primaryImage = (item: MenuItem): string | null => {
  if (item.images.length === 0) return defaultProductImage(item.name)
  const primary = item.images.find((image) => image.isPrimary)
  return (primary ?? item.images[0]).url
}
