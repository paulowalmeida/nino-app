import { Field } from '@ark-ui/react/field'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { FormFieldProps } from './FormField.types'

const baseLabel = 'text-sm font-medium text-body leading-none'
const baseHelper = 'text-sm text-subtle'
const baseError = 'text-sm text-danger'
const baseRequired = 'ml-1 text-danger'
const horizontalRow = 'flex items-center gap-2'

/**
 * Wraps a form input with label, helper text, and error message.
 * Uses Ark UI Field for built-in accessibility (aria-describedby, aria-invalid).
 *
 * @param label - Label text shown next to the input
 *
 * @param helperText - Helper text shown below the input
 *
 * @param error - Error message — also puts the field in invalid state
 *
 * @param required - Adds a required indicator (*) to the label
 *
 * @param orientation - `vertical` (label above, default) or `horizontal`
 * (control and label side by side — for Checkbox/Switch)
 *
 * @param labelClassName - Overrides the label's typography (size, weight,
 * color) for screens with their own label voice, without giving up the
 * built-in accessibility wiring
 *
 * @param children - The input element
 */
export function FormField({
  label,
  helperText,
  error,
  required,
  orientation = 'vertical',
  labelClassName,
  children,
  className,
}: FormFieldProps) {
  const isHorizontal = orientation === 'horizontal'

  const labelEl = label && (
    <Field.Label className={mergeClasses(baseLabel, labelClassName)}>
      {label}
      {required && <Field.RequiredIndicator className={baseRequired} />}
    </Field.Label>
  )

  const message = error ? (
    <Field.ErrorText className={baseError}>{error}</Field.ErrorText>
  ) : helperText ? (
    <Field.HelperText className={baseHelper}>{helperText}</Field.HelperText>
  ) : null

  return (
    <Field.Root
      invalid={!!error}
      required={required}
      className={mergeClasses('flex flex-col gap-1.5', className)}
    >
      {isHorizontal ? (
        <div className={horizontalRow}>
          {children}
          {labelEl}
        </div>
      ) : (
        <>
          {labelEl}
          {children}
        </>
      )}
      {message}
    </Field.Root>
  )
}

FormField.displayName = 'FormField'
