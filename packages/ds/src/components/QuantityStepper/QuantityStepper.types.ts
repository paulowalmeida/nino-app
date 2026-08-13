import { HTMLAttributes, ReactNode } from 'react'

export type QuantityStepperSize = 'sm' | 'md'

export type QuantityStepperDecrementIcon = 'minus' | 'trash'

export interface QuantityStepperProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  incrementLabel: string
  decrementLabel: string
  /** `trash` when the next decrement removes the item instead of lowering it */
  decrementIcon?: QuantityStepperDecrementIcon
  isDecrementDisabled?: boolean
  size?: QuantityStepperSize
  /** Node rendered in place of the plain quantity */
  count?: ReactNode
}
