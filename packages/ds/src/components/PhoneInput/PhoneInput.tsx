import { maskPhone } from '@ds/lib/masks/masks'

import { MaskedInput } from '../MaskedInput/MaskedInput'
import { MaskedInputProps } from '../MaskedInput/MaskedInput.types'

type PhoneInputProps = Omit<MaskedInputProps, 'mask'>

/**
 * Brazilian phone field — `(00) 00000-0000`.
 *
 * The mask takes both landline and mobile: it only settles on the ninth
 * digit once it is typed, instead of forcing a shape on what was entered.
 *
 * @example
 * <FormField label="Telefone">
 *   <PhoneInput {...register('phone')} />
 * </FormField>
 */
export function PhoneInput(props: PhoneInputProps) {
  return (
    <MaskedInput mask={maskPhone} placeholder="(00) 00000-0000" {...props} />
  )
}
