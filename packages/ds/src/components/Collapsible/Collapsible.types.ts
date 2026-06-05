import type { ReactNode } from 'react'

export interface CollapsibleProps {
  /** Always-visible element that toggles the content */
  trigger: ReactNode
  /** Collapsible content revealed when open */
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
}
