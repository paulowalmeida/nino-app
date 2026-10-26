import { InputHTMLAttributes, Ref } from 'react'

export type InputSize = 'sm' | 'md' | 'lg'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /**
   * Height and padding. Default: `md`. `lg` is the one that clears the 44px
   * touch target on its own
   */
  size?: InputSize
  /**
   * Paints the invalid state. Redundant inside a `FormField` that already got
   * an `error`
   */
  error?: boolean
  /** Forwarded to the `<input>`, for focus and for form libraries */
  ref?: Ref<HTMLInputElement>
}
