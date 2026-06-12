import { forwardRef } from 'react'

import { maskCpf } from '@ds/lib/masks/masks'

import { MaskedInput } from '../MaskedInput'
import { CpfInputProps } from './CpfInput.types'

/** CPF field with Brazilian mask — 000.000.000-00. */
export const CpfInput = forwardRef<HTMLInputElement, CpfInputProps>(
  (props, ref) => (
    <MaskedInput
      ref={ref}
      mask={maskCpf}
      placeholder="000.000.000-00"
      {...props}
    />
  )
)

CpfInput.displayName = 'CpfInput'
