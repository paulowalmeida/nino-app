export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong'

export interface PasswordStrengthProps {
  /** Password value to evaluate */
  password: string
  /** Additional CSS classes */
  className?: string
}
