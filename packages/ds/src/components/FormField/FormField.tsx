import { ReactNode } from 'react'

import { Field } from '@ark-ui/react/field'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './FormField.module.css'

type FormFieldOrientation = 'vertical' | 'horizontal'

type FormFieldLabelVariant = 'default' | 'compact'

type FormFieldProps = {
  /**
   * Text next to the control. Takes a node, for the muted "(opcional)" that
   * some labels carry inline
   */
  label?: ReactNode
  /** Line below the control, explaining what to type */
  helperText?: string
  /**
   * Error message. Also puts the control in the invalid state, and replaces
   * the helper text while it shows
   */
  error?: string
  /** Marks the label with the required indicator */
  required?: boolean
  /**
   * `vertical` (default) puts the label above; `horizontal` puts it beside
   * the control — the shape of Checkbox and Switch
   */
  orientation?: FormFieldOrientation
  /**
   * `default` for a form the screen is built around; `compact` for a data
   * sheet, where the label is the caption of the value below it and must
   * weigh less than it
   */
  labelVariant?: FormFieldLabelVariant
  children: ReactNode
  className?: string
}

const labelClasses: Record<FormFieldLabelVariant, string> = {
  default: styles.labelDefault,
  compact: styles.labelCompact,
}

/**
 * Wraps a form control with its label, helper text and error message.
 *
 * The wiring between the three is what this exists for: the label points at
 * the control, the message is announced with it, and an error flips the
 * control to invalid — none of which a hand-built `<label>` + `<span>` does
 * on its own.
 *
 * ```tsx
 * <FormField label="E-mail" error={errors.email?.message}>
 *   <Input {...register('email')} />
 * </FormField>
 * ```
 */
export function FormField({
  label,
  helperText,
  error,
  required,
  orientation = 'vertical',
  labelVariant = 'default',
  children,
  className,
}: FormFieldProps) {
  const isHorizontal = orientation === 'horizontal'

  const labelEl = label && (
    <Field.Label className={labelClasses[labelVariant]}>
      {label}
      {required && <Field.RequiredIndicator className={styles.requiredMark} />}
    </Field.Label>
  )

  const message = error ? (
    <Field.ErrorText className={styles.errorText}>{error}</Field.ErrorText>
  ) : helperText ? (
    <Field.HelperText className={styles.helperText}>
      {helperText}
    </Field.HelperText>
  ) : null

  return (
    <Field.Root
      invalid={!!error}
      required={required}
      className={mergeClasses(styles.field, className)}
    >
      {isHorizontal ? (
        <div className={styles.horizontalRow}>
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
