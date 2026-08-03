import { ModalSize } from '@ds/components/Modal'

export type DialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  size?: ModalSize
}
