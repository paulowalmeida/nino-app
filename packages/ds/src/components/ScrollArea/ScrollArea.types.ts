import type { ReactNode } from 'react'

export interface ScrollAreaProps {
  /** Scrollable content */
  children: ReactNode
  /** Classes for the root — typically a height/max-height constraint */
  className?: string
}
