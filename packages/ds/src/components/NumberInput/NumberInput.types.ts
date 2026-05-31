export type NumberInputSize = 'sm' | 'md' | 'lg'

export interface NumberInputProps {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  name?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: NumberInputSize
  className?: string
}
