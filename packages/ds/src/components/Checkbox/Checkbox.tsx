import { FocusEventHandler, Ref } from 'react'

import { Checkbox as ArkCheckbox } from '@ark-ui/react/checkbox'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import { Icon } from '../Icon/Icon'
import styles from './Checkbox.module.css'

type CheckboxSize = 'sm' | 'md' | 'lg'

type CheckboxProps = {
  /** Size of the checkbox control. Default: `md` */
  size?: CheckboxSize
  /** Applies error styles to indicate invalid state */
  error?: boolean
  /** Controlled checked state (`true`, `false`, or `'indeterminate'`) */
  checked?: boolean | 'indeterminate'
  /** Uncontrolled initial checked state */
  defaultChecked?: boolean
  /** Fired when the checked state changes */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void
  /** Disables the checkbox */
  disabled?: boolean
  /** Marks the checkbox as required in a form context */
  required?: boolean
  /** Name attribute for form submission */
  name?: string
  /** Value attribute for form submission */
  value?: string
  /** Additional CSS classes for the control element */
  className?: string
  /** Fired when focus leaves the control, for a form that validates on blur */
  onBlur?: FocusEventHandler<HTMLInputElement>
  /**
   * Points at the hidden input, which is what takes focus — a form library
   * moving focus to the first invalid field lands here
   */
  ref?: Ref<HTMLInputElement>
}

const sizeClasses: Record<CheckboxSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
}

const iconSizeClasses: Record<CheckboxSize, string> = {
  sm: styles.checkSizeSmall,
  md: styles.checkSizeMedium,
  lg: styles.checkSizeLarge,
}

/**
 * Checkbox built on top of Ark UI Checkbox.
 *
 */
export function Checkbox({
  size = 'md',
  error = false,
  className,
  onCheckedChange,
  onBlur,
  ref,
  ...props
}: CheckboxProps) {
  return (
    <ArkCheckbox.Root
      onCheckedChange={({ checked }) => onCheckedChange?.(checked)}
      {...props}
    >
      <ArkCheckbox.Control
        className={mergeClasses(
          styles.box,
          sizeClasses[size],
          error ? styles.boxInvalid : styles.boxResting,
          className
        )}
      >
        <ArkCheckbox.Indicator className={styles.checkMark}>
          <Icon name="check" className={iconSizeClasses[size]} />
        </ArkCheckbox.Indicator>
      </ArkCheckbox.Control>
      <ArkCheckbox.HiddenInput ref={ref} onBlur={onBlur} />
    </ArkCheckbox.Root>
  )
}
