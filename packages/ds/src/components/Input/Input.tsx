import { Field } from '@ark-ui/react/field'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Input.module.css'
import { InputProps, InputSize } from './Input.types'

const sizeClasses: Record<InputSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
}

/**
 * Single-line text field.
 *
 * Inside a `FormField` it picks up the label, the description and the
 * invalid state on its own — that is Ark's `Field` wiring, not something the
 * screen has to repeat. Standalone it behaves as a plain `<input>`.
 *
 * @example
 * <FormField label="E-mail" error={errors.email?.message}>
 *   <Input {...register('email')} />
 * </FormField>
 */
export function Input({
  size = 'md',
  error = false,
  className,
  ...props
}: InputProps) {
  return (
    <Field.Input
      data-invalid={error || undefined}
      className={mergeClasses(styles.input, sizeClasses[size], className)}
      {...props}
    />
  )
}
