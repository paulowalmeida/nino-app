export type SwitchSize = 'sm' | 'md'

export interface SwitchProps {
  size?: SwitchSize
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  id?: string
  disabled?: boolean
  name?: string
  value?: string
  className?: string
}
