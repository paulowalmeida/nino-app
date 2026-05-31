export type ComboboxSize = 'sm' | 'md' | 'lg'

export type ComboboxInputRef = HTMLInputElement

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  placeholder?: string
  size?: ComboboxSize
  error?: boolean
  disabled?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  emptyMessage?: string
  className?: string
}
