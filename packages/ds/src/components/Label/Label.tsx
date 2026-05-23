import { Label as RadixLabel } from '@radix-ui/react-label'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { LabelProps } from './Label.types'

/**
 * Form label built on top of Radix UI Label.
 * Correctly associates with the input via `htmlFor`,
 * and optionally marks the field as required.
 *
 * @param htmlFor - ID of the associated input element
 * @param required - Appends a red asterisk to indicate a required field
 * @param className - Additional CSS classes merged with base styles
 *
 * @example
 * <Label htmlFor="email">Email</Label>
 * <Label htmlFor="name" required>Full name</Label>
 */
export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <RadixLabel
      className={mergeClasses(
        'text-sm font-medium text-gray-700 leading-none',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-1 text-red-500">
          *
        </span>
      )}
    </RadixLabel>
  )
}
