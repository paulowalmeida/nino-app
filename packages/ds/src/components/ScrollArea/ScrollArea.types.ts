import type { CSSProperties, ReactNode } from 'react'

export type ScrollAreaProps = {
  /** Scrollable content */
  children: ReactNode
  /** Classes for the root — typically a height/max-height constraint */
  className?: string
  /** Inline sizing, for heights that do not come from a utility class */
  style?: CSSProperties
}
