import type { CSSProperties, ReactNode } from 'react'

export type ScrollAreaProps = {
  /** Scrollable content */
  children: ReactNode
  /** Classes for the root — typically a height/max-height constraint */
  className?: string
  /**
   * Fades the content against any edge it can still scroll past. Opt-in: the
   * mask is a paint effect over the whole viewport, so it is off by default
   * and each caller decides. Defaults to `false`.
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
