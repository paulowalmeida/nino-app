import { ReactNode } from 'react'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  header?: ReactNode
  body?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  ariaLabel?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
