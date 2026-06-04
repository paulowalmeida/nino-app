import { Field } from '@ark-ui/react/field'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { LabelProps } from './Label.types'

const baseLabel =
  'text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50'

const requiredMark = 'ml-1 text-red-500'

/**
 * Form label. Renders Ark `Field.Label`: inside a `Field.Root` (via
 * `FormField`) the `htmlFor` connects to the field automatically; standalone
 * it behaves as a plain `<label>`.
 */
export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <Field.Label className={mergeClasses(baseLabel, className)} {...props}>
      {children}
      {required && (
        <span aria-hidden="true" className={requiredMark}>
          *
        </span>
      )}
    </Field.Label>
  )
}
