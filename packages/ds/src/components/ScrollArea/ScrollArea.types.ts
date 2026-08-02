import type { CSSProperties, ReactNode } from 'react'

export type ScrollAreaProps = {
  /** Scrollable content */
  children: ReactNode
  /** Classes for the root — typically a height/max-height constraint */
  className?: string
  /**
   * Fades the content against the edge it can still scroll past, on both
   * axes. Driven by the scroll position itself; nothing fades when the axis
   * has no overflow. Turn it off for content that must stay fully opaque,
   * such as a table with a sticky header. Defaults to `true`.
   */
  fadeEdges?: boolean
  /** Inline sizing, for heights that do not come from a utility class */
  style?: CSSProperties
  /**
   * Scrollbar thumb colour. Defaults to the brand orange; takes any CSS
   * colour, so a tenant with its own palette can pass a hex (`#0f766e`) or a
   * token (`var(--color-ink)`).
   */
  thumbColor?: string
}
