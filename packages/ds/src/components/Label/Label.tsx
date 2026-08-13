import { ComponentPropsWithoutRef } from 'react'

import { Field } from '@ark-ui/react/field'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Label.module.css'

type LabelProps = ComponentPropsWithoutRef<'label'> & {
  /**
   * Marks the field as required with an asterisk. The mark is decoration for
   * a screen reader; what announces the requirement is the `required` on the
   * control itself
   */
  required?: boolean
}

/**
 * Name of a field, tied to it.
 *
 * Inside a `FormField` the connection is made for you — reach for this one
 * only when labelling something outside that wiring, and give it `htmlFor`.
 *
 * @example
 * <Label htmlFor="cnpj" required>CNPJ</Label>
 */

export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <Field.Label className={mergeClasses(styles.label, className)} {...props}>
      {children}
      {required && (
        <span aria-hidden="true" className={styles.requiredMark}>
          *
        </span>
      )}
    </Field.Label>
  )
}
