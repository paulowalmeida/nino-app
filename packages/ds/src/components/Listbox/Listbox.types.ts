export interface ListboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ListboxProps {
  /** Selectable options */
  options: ListboxOption[]
  /** Controlled selected values */
  value?: string[]
  /** Uncontrolled initial selection */
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Selection mode. Default: `single` */
  selectionMode?: 'single' | 'multiple'
  /** Optional label above the list */
  label?: string
  className?: string
}
