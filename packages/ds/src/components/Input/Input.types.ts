import { InputHTMLAttributes } from 'react'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  /** Height and padding of the input. Default: `md` */
  size?: InputSize
  /** Applies error styles to indicate invalid input */
  error?: boolean
  /** Additional CSS classes merged with base styles */
  className?: string
}
