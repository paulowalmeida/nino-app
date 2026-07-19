import type { MenuItemImage } from '@custom_types/product'

export type ItemPhotoProps = {
  tenantId: string | null
  productId: string
  name: string
  images: MenuItemImage[]
}
