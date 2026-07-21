import type { MenuItemImage } from '@custom_types/product'

export type ItemPhotoProps = {
  tenantId: string | null
  /**
   * `null` antes do item existir (tela de criação): a foto fica só
   * recortada e local, e `onStagedFile` recebe o arquivo pronto para o
   * caller enviar depois que o item tiver um id.
   */
  productId: string | null
  name: string
  images: MenuItemImage[]
  onStagedFile?: (file: File | null) => void
}
