import { InputProps } from '../Input/Input.types'

export type MaskedInputProps = InputProps & {
  /**
   * Formats the raw value. `maskCpf`, `maskPhone` and the others live in
   * `@nino/ds/masks`
   */
  mask: (value: string) => string
}
