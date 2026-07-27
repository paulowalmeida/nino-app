import { HTMLAttributes } from 'react'

export type CardVariant = 'default' | 'flat' | 'elevated'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  /**
   * Delegates rendering to the direct child via Radix Slot — for when the
   * surface itself is the click target (a link or a button).
   */
  asChild?: boolean
}
