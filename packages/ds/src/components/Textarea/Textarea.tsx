import { Ref, TextareaHTMLAttributes } from 'react'

import { Field } from '@ark-ui/react/field'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Textarea.module.css'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /**
   * Paints the invalid state. Redundant inside a `FormField` that already got
   * an `error`
   */
  error?: boolean
  /** Forwarded to the `<textarea>`, for focus and for form libraries */
  ref?: Ref<HTMLTextAreaElement>
}

/**
 * Multi-line field, for what does not fit on one line — a description, a
 * note to the kitchen, an address complement.
 *
 * Inside a `FormField` it picks up the label, the description and the
 * invalid state on its own. It grows only downward, by dragging the corner:
 * growing sideways would break the column of the form.
 *
 * ```tsx
 * <FormField label="Descrição" helperText="Aparece no cardápio">
 *   <Textarea rows={4} {...register('description')} />
 * </FormField>
 *
 * - `rows` — Starting height in lines. The field never shrinks below five lines of room
 * ```
 */
export function Textarea({
  error = false,
  className,
  ...props
}: TextareaProps) {
  return (
    <Field.Textarea
      data-invalid={error || undefined}
      className={mergeClasses(styles.textarea, className)}
      {...props}
    />
  )
}
