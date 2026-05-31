export type SelectSize = 'sm' | 'md' | 'lg'

export type SelectTriggerRef = HTMLButtonElement

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  placeholder?: string
  size?: SelectSize
  error?: boolean
  disabled?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
}
