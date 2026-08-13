import { FocusEventHandler, Ref } from 'react'

import { Checkbox as ArkCheckbox } from '@ark-ui/react/checkbox'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import { Icon } from '../Icon/Icon'
import styles from './Checkbox.module.css'

type CheckboxSize = 'sm' | 'md' | 'lg'

type CheckboxProps = {
  size?: CheckboxSize
  error?: boolean
  checked?: boolean | 'indeterminate'
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean | 'indeterminate') => void
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
  className?: string
  onBlur?: FocusEventHandler<HTMLInputElement>
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
 * @param size - Size of the checkbox control. Default: `md`
 *
 * @param error - Applies error styles to indicate invalid state
 *
 * @param checked - Controlled checked state (`true`, `false`, or
 * `'indeterminate'`)
 *
 * @param defaultChecked - Uncontrolled initial checked state
 *
 * @param onCheckedChange - Fired when the checked state changes
 *
 * @param disabled - Disables the checkbox
 *
 * @param required - Marks the checkbox as required in a form context
 *
 * @param name - Name attribute for form submission
 *
 * @param value - Value attribute for form submission
 *
 * @param className - Additional CSS classes for the control element
 *
 * @param onBlur - Fired when focus leaves the control, for a form that
 * validates on blur
 *
 * @param ref - Points at the hidden input, which is what takes focus — a
 * form library moving focus to the first invalid field lands here
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
