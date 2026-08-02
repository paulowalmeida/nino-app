export type RemoveUnitModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Nome que a pessoa vai ter de digitar — o mesmo que aparece na lista. */
  unitName: string
  loading?: boolean
  onConfirm: () => void
}
