import { ButtonHTMLAttributes } from 'react'

export type ChipVariant = 'tab' | 'toggle'

export interface ChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'role'> {
  /**
   * `tab` marks the chip as one of a `role="tablist"` group — exclusive
   * choice, exposed via `aria-selected`. `toggle` is a standalone on/off
   * chip, exposed via `aria-pressed`.
   */
  variant: ChipVariant
  selected: boolean
}
