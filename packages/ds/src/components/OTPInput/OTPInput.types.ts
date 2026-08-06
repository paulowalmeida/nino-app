export type OTPInputType = 'numeric' | 'alphabetic' | 'alphanumeric'

export type OTPInputProps = {
  length?: 4 | 6
  value?: string[]
  onValueChange?: (value: string[]) => void
  onValueComplete?: (value: string) => void
  placeholder?: string
  type?: OTPInputType
  /** Enables SMS OTP autocomplete */
  otp?: boolean
  disabled?: boolean
  invalid?: boolean
  className?: string
}
