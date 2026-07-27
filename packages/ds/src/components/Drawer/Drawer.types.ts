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
  /**
   * Extra classes for the scrolling body. Use it when the drawer's own child
   * owns the scrolling — a cart that keeps its total fixed and scrolls only
   * the item list needs the body to stop scrolling and hand over its height.
   */
  bodyClassName?: string
}
