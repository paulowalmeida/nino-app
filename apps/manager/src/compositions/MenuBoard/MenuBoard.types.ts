export type MenuBoardProps = {
  tenantId: string | null
  /** `null` é o cardápio inteiro; com categoria escolhida o arraste liga. */
  categoryId: string | null
  search: string
}
