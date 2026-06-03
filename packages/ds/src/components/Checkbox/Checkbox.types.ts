export type CheckboxSize = 'sm' | 'md' | 'lg'

export type CheckboxRef = HTMLDivElement

export interface CheckboxProps {
  size?: CheckboxSize
  error?: boolean
  checked?: boolean | 'indeterminate'
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean | 'indeterminate') => void
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
  className?: string
}
