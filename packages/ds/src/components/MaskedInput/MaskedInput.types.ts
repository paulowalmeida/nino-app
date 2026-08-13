import { InputProps } from '../Input/Input.types'

export type MaskedInputProps = InputProps & {
  mask: (value: string) => string
}
