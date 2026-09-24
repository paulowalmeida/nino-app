import type { MenuItem } from '@custom_types/menu/menu-item'
import { resolveApiAssetUrl } from '@utils/api-asset-url/api-asset-url'

/** A foto que representa o item: a marcada como principal, ou a primeira. */
export const primaryImage = (item: MenuItem): string | null => {
  if (item.images.length === 0) return resolveApiAssetUrl(item.fallbackUrl)
  const primary = item.images.find((image) => image.isPrimary)
  return (primary ?? item.images[0]).url
}
