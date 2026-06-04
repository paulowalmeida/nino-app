import { ComponentPropsWithoutRef } from 'react'

import { ModalSize } from '@ds/components/Modal'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export interface DialogProps extends Pick<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
  'open' | 'onOpenChange'
> {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  size?: ModalSize
}
