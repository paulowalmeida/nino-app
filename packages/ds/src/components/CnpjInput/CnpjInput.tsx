import { forwardRef } from 'react'

import { maskCnpj } from '@ds/lib/masks/masks'

import { MaskedInput } from '../MaskedInput'
import { CnpjInputProps } from './CnpjInput.types'

/** CNPJ field with Brazilian mask — 00.000.000/0000-00. */
export const CnpjInput = forwardRef<HTMLInputElement, CnpjInputProps>(
  (props, ref) => (
    <MaskedInput
      ref={ref}
      mask={maskCnpj}
      placeholder="00.000.000/0000-00"
      {...props}
    />
  )
)

CnpjInput.displayName = 'CnpjInput'
