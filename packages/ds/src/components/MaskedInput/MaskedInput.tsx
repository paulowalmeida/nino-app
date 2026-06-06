import { ChangeEvent, forwardRef } from 'react'

import { Input } from '../Input'
import { MaskedInputProps } from './MaskedInput.types'

/**
 * Text input that formats its value with a `mask` function on every
 * change. Forwards ref and native props, so it's a drop-in for
 * react-hook-form `register`. The masked (formatted) value is what gets
 * stored — use `onlyDigits` from `@nino/ds` to strip it before submit.
 *
 * @param mask - Function that formats the raw value (e.g. `maskCpf`)
 *
 * @param size - Height and padding. Default: `md`
 *
 * @param error - Applies error styles
 */
export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onChange, inputMode = 'numeric', ...props }, ref) => {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      event.target.value = mask(event.target.value)
      onChange?.(event)
    }

    return (
      <Input
        ref={ref}
        inputMode={inputMode}
        onChange={handleChange}
        {...props}
      />
    )
  }
)

MaskedInput.displayName = 'MaskedInput'
