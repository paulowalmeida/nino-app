import { ReactNode } from 'react'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: TooltipPlacement
  sideOffset?: number
  delayDuration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}
