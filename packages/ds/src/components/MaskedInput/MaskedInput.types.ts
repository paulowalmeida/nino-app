import { InputProps } from '../Input/Input.types'

export interface MaskedInputProps extends InputProps {
  /** Formatting function applied to the value on every change */
  mask: (value: string) => string
}
