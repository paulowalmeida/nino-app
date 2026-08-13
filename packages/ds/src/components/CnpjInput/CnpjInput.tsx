import { maskCnpj } from '@ds/lib/masks/masks'

import { MaskedInput } from '../MaskedInput/MaskedInput'
import { MaskedInputProps } from '../MaskedInput/MaskedInput.types'

type CnpjInputProps = Omit<MaskedInputProps, 'mask'>

/**
 * CNPJ field — `00.000.000/0000-00`.
 *
 * It only formats; it does not check the verifier digits. Use `isValidCnpj`
 * from `@nino/ds/validators` for that, in the form's own validation.
 *
 * ```tsx
 * <FormField label="CNPJ" error={errors.cnpj?.message}>
 *   <CnpjInput {...register('cnpj', { validate: isValidCnpj })} />
 * </FormField>
 * ```
 */
export function CnpjInput(props: CnpjInputProps) {
  return (
    <MaskedInput mask={maskCnpj} placeholder="00.000.000/0000-00" {...props} />
  )
}
