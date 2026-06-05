import type { ReactNode } from 'react'

export interface HoverCardProps {
  /** Element that reveals the card on hover/focus */
  trigger: ReactNode
  /** Rich content shown inside the floating card */
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Delay in ms before opening. Default: `300` */
  openDelay?: number
  /** Delay in ms before closing. Default: `200` */
  closeDelay?: number
}
