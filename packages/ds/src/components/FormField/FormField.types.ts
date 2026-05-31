import { ReactNode } from 'react'

export type FormFieldOrientation = 'vertical' | 'horizontal'

export interface FormFieldProps {
  /** Label text shown next to the input */
  label?: string
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
  /** The input element */
  children: ReactNode
  /** Additional CSS classes on the root element */
  className?: string
}
