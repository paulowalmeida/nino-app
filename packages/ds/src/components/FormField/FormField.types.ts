import { ReactNode } from 'react'

export type FormFieldOrientation = 'vertical' | 'horizontal'

export interface FormFieldProps {
  /** Label content shown next to the input — usually text, but accepts a
   * node for cases like a muted "(optional)" suffix inline with the label */
  label?: ReactNode
  /** Helper text shown below the input */
  helperText?: string
  /** Error message — also puts the field in invalid state */
  error?: string
  /** Adds a required indicator (*) to the label */
  required?: boolean
  /**
   * Layout of label and control. `vertical` (default) stacks label above the
   * control; `horizontal` places them side by side — for Checkbox/Switch.
   */
  orientation?: FormFieldOrientation
  /** Overrides the label's typography, merged with the default style */
  labelClassName?: string
  /** The input element */
  children: ReactNode
  /** Additional CSS classes on the root element */
  className?: string
}
