import { HTMLAttributes } from 'react'

export type CardVariant = 'default' | 'flat' | 'elevated'

export interface CardProps extends HTMLAttributes<HTMLDivElement | HTMLButtonElement> {
  variant?: CardVariant
  /**
   * Delegates rendering to the direct child via Radix Slot — for when the
   * click target is something with its own semantics (a `Link`, for a
   * navigation card).
   */
  asChild?: boolean
}
