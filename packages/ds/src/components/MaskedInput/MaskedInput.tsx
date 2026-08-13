import { ChangeEvent } from 'react'

import { Input } from '../Input/Input'
import { MaskedInputProps } from './MaskedInput.types'

/**
 * Text field that reformats what was typed on every keystroke.
 *
 * What reaches the form is the formatted value, dots and dashes included —
 * `onlyDigits` strips it before the request. It takes the same props as
 * `Input`, so `register` from react-hook-form drops straight in.
 *
 * @param mask - Formats the raw value. `maskCpf`, `maskPhone` and the others
 * live in `@nino/ds/masks`
 *
 * @param inputMode - Keyboard the phone opens. Default: `numeric`, since
 * every mask in the catalog is made of digits
 *
 * @example
 * <MaskedInput mask={maskCpf} {...register('cpf')} />
 */
export function MaskedInput({
  mask,
  onChange,
  inputMode = 'numeric',
  ...props
}: MaskedInputProps) {
  /* Reescreve o valor no próprio evento antes de repassá-lo: é o que faz o
   * `register` do react-hook-form guardar o texto já formatado, sem o
   * componente precisar de estado próprio para isso. */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = mask(event.target.value)
    onChange?.(event)
  }

  return <Input inputMode={inputMode} onChange={handleChange} {...props} />
}
