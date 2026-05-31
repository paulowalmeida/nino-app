import { forwardRef } from 'react'

import { Field } from '@ark-ui/react/field'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { TextareaProps } from './Textarea.types'

const baseTextarea =
  'w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors outline-none resize-y min-h-[80px] disabled:cursor-not-allowed disabled:opacity-50'

const stateDefault =
  'border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400'

const stateError =
  'aria-[invalid]:border-red-500 aria-[invalid]:focus:ring-red-500 ' +
  'aria-[invalid]:focus:border-red-500 data-[invalid]:border-red-500 ' +
  'data-[invalid]:focus:ring-red-500 data-[invalid]:focus:border-red-500'

/**
 * Multiline text input. Renders Ark `Field.Textarea`: inside a `Field.Root`
 * (via `FormField`) it inherits the field wiring; standalone it behaves as a
 * plain `<textarea>`.
 *
 * @param error - Applies error styles to indicate invalid state
 *
 * @param className - Additional CSS classes
 *
 * @param disabled - Disables the textarea
 *
 * @example
 * <Textarea placeholder="Descrição..." rows={4} />
 * <Textarea error value={value} onChange={onChange} />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className, ...props }, ref) => (
    <Field.Textarea
      ref={ref}
      data-invalid={error || undefined}
      className={mergeClasses(
        baseTextarea,
        stateDefault,
        stateError,
        className
      )}
      {...props}
    />
  )
)

Textarea.displayName = 'Textarea'
