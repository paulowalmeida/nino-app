import { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

export type ButtonSize = 'sm' | 'md' | 'lg'

type MotionConflicts =
  | 'onDrag'
  | 'onDragEnd'
  | 'onDragStart'
  | 'onDragEnter'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onAnimationStart'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionConflicts> {
  /** Visual style of the button. Default: `primary` */
  variant?: ButtonVariant
  /** Height and padding of the button. Default: `md` */
  size?: ButtonSize
  /** Shows a loading indicator and blocks interaction while an action is in progress */
  loading?: boolean
  /** Loading indicator style. Default: `spinner` */
  loadingIndicator?: 'spinner' | 'dots'
  /**
   * Delegates rendering to the direct child via Radix Slot.
   * Useful for rendering the Button as `<a>`, `<Link>`, or another element.
   * @example
   * <Button asChild><a href="/route">See more</a></Button>
   */
  asChild?: boolean
}
