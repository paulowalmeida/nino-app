import { forwardRef } from 'react'

import { Field } from '@ark-ui/react/field'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { TextareaProps } from './Textarea.types'

const baseTextarea =
  'w-full rounded-card border bg-surface-sunk px-3 py-2 text-sm text-ink placeholder:text-faint transition-colors outline-none resize-y min-h-[80px] disabled:cursor-not-allowed disabled:opacity-50'

const stateDefault =
  'border-transparent focus:ring-2 focus:ring-brand/25 focus:border-brand'

const stateError =
  'aria-[invalid]:border-danger aria-[invalid]:focus:ring-danger ' +
  'aria-[invalid]:focus:border-danger data-[invalid]:border-danger ' +
  'data-[invalid]:focus:ring-danger data-[invalid]:focus:border-danger'

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
