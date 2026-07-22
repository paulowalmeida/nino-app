import { ComboboxSize } from '@ds/components/Combobox'

export interface TimePickerProps {
  /** Minutos entre cada horário da lista. Default: `15` */
  step?: number
  placeholder?: string
  size?: ComboboxSize
  error?: boolean
  disabled?: boolean
  /** Horário selecionado, no formato `HH:mm` */
  value?: string
  defaultValue?: string
  /** Disparado com o horário escolhido, no formato `HH:mm` */
  onValueChange?: (value: string) => void
  className?: string
  ariaLabel?: string
}
