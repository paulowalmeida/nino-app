import { maskCpf } from '@ds/lib/masks/masks'

import { MaskedInput } from '../MaskedInput/MaskedInput'
import { MaskedInputProps } from '../MaskedInput/MaskedInput.types'

type CpfInputProps = Omit<MaskedInputProps, 'mask'>

/**
 * CPF field — `000.000.000-00`.
 *
 * It only formats; it does not check the verifier digits. Use `isValidCpf`
 * from `@nino/ds/validators` for that, in the form's own validation.
 *
 * @example
 * <FormField label="CPF" error={errors.cpf?.message}>
 *   <CpfInput {...register('cpf', { validate: isValidCpf })} />
 * </FormField>
 */
export function CpfInput(props: CpfInputProps) {
  return <MaskedInput mask={maskCpf} placeholder="000.000.000-00" {...props} />
}
