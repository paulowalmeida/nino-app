import type { MenuItem } from '@custom_types/product'

export type MenuBoardProps = {
  tenantId: string | null
  /** `null` é o cardápio inteiro; com categoria escolhida o arraste liga. */
  categoryId: string | null
  search: string
}

export type DeleteItemDialogProps = {
  tenantId: string | null
  item: MenuItem
  onClose: () => void
}
