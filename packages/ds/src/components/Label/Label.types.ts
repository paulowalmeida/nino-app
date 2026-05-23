import { ComponentPropsWithoutRef } from 'react'
import { Label as RadixLabel } from '@radix-ui/react-label'

export interface LabelProps extends ComponentPropsWithoutRef<typeof RadixLabel> {
  /** Appends a red asterisk to indicate a required field */
  required?: boolean
}
