import { forwardRef } from 'react'

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
  'border-input-border focus:ring-2 focus:ring-input-border-focus focus:border-input-border-focus'

const inputError =
  'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'

/**
 * Text input field with size variants and error state.
 * Forwards refs to the underlying `<input>` element.
 *
 * @param size - Height and padding of the input. Default: `md`
 * @param error - Applies error styles to indicate invalid input
 * @param disabled - Disables the input
 * @param placeholder - Placeholder text shown when the input is empty
 * @param className - Additional CSS classes merged with base styles
 *
 * @param onChange - Fired when the input value changes
 * @param onFocus - Fired when the input receives focus
 * @param onBlur - Fired when the input loses focus
 * @param onKeyDown - Fired when a key is pressed while the input is focused
 *
 * @example
 * <Input placeholder="Enter your email" />
 * <Input size="lg" error />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', error = false, className, ...props }, ref) => (
    <input
      ref={ref}
      className={mergeClasses(
        baseInput,
        sizeClasses[size],
        error ? inputError : inputDefault,
        baseDisabled,
        className
      )}
      {...props}
    />
  )
)

Input.displayName = 'Input'
