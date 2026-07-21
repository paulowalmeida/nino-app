import { ReactNode } from 'react'

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  placement?: DrawerPlacement
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  /** Width (for left/right) or height (for top/bottom). E.g. '400px', '80%' */
  size?: string
  /** Extra classes for the content surface — for apps with their own theme. */
  contentClassName?: string
}
