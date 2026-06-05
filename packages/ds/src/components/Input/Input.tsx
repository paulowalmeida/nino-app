import { forwardRef } from 'react'

import { Field } from '@ark-ui/react/field'
import { baseDisabled } from '@ds/lib/baseClasses'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { InputProps, InputSize } from './Input.types'

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const baseInput =
  'w-full rounded-md border bg-white text-gray-900 placeholder:text-gray-400 transition-colors outline-none'

const inputDefault =
  'border-gray-300 focus:ring-2 focus:ring-brand/25 focus:border-brand'

const inputError =
  'aria-[invalid]:border-red-500 aria-[invalid]:focus:ring-red-500 ' +
  'aria-[invalid]:focus:border-red-500 data-[invalid]:border-red-500 ' +
  'data-[invalid]:focus:ring-red-500 data-[invalid]:focus:border-red-500'

/**
 * Text input field with size variants and error state.
 * Renders Ark `Field.Input`: inside a `Field.Root` (via `FormField`) it
 * inherits `aria-invalid`/`id`/`aria-describedby`; standalone it behaves
 * as a plain `<input>`.
 *
 * @param size - Height and padding of the input. Default: `md`
 *
 * @param error - Applies error styles to indicate invalid input
 *
 * @param disabled - Disables the input
 *
 * @param placeholder - Placeholder text shown when the input is empty
 *
 * @param className - Additional CSS classes merged with base styles
 *
 * @param onChange - Fired when the input value changes
 *
 * @param onFocus - Fired when the input receives focus
 *
 * @param onBlur - Fired when the input loses focus
 *
 * @param onKeyDown - Fired when a key is pressed while the input is focused
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', error = false, className, ...props }, ref) => (
    <Field.Input
      ref={ref}
      data-invalid={error || undefined}
      className={mergeClasses(
        baseInput,
        sizeClasses[size],
        inputDefault,
        inputError,
        baseDisabled,
        className
      )}
      {...props}
    />
  )
)

Input.displayName = 'Input'
