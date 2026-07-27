import type { ReactNode } from 'react'

export type CollapsibleProps = {
  /** Always-visible element that toggles the content */
  trigger: ReactNode
  /** Collapsible content revealed when open */
  children: ReactNode
  /**
   * Draws the chevron seal on the right of the trigger. Leave it off when the
   * trigger already carries its own open/close cue.
   */
  indicator?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
}
