import { ReactNode } from 'react'

export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  title?: ReactNode
  placement?: PopoverPlacement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
