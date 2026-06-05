export type PasswordInputSize = 'sm' | 'md' | 'lg'

export interface PasswordInputProps {
  /** Height and padding of the field. Default: `md` */
  size?: PasswordInputSize
  /** Applies error styles to indicate invalid input */
  error?: boolean
  disabled?: boolean
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  id?: string
  name?: string
  className?: string
}
