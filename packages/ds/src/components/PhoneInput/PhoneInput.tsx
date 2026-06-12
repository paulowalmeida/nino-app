import { forwardRef } from 'react'

import { maskPhone } from '@ds/lib/masks/masks'

import { MaskedInput } from '../MaskedInput'
import { PhoneInputProps } from './PhoneInput.types'

/** Phone field with Brazilian mask — (00) 00000-0000. */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (props, ref) => (
    <MaskedInput
      ref={ref}
      mask={maskPhone}
      placeholder="(00) 00000-0000"
      {...props}
    />
  )
)

PhoneInput.displayName = 'PhoneInput'
