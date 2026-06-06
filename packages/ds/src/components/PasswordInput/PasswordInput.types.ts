import { InputHTMLAttributes } from 'react'

export type PasswordInputSize = 'sm' | 'md' | 'lg'

export interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  /** Height and padding of the field. Default: `md` */
  size?: PasswordInputSize
  /** Applies error styles to indicate invalid input */
  error?: boolean
  /** Additional CSS classes merged with base styles */
  className?: string
}
