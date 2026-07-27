import { forwardRef } from 'react'

import { Checkbox as ArkCheckbox } from '@ark-ui/react/checkbox'
import { baseDisabled, baseFocus } from '@ds/lib/baseClasses'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { CheckboxProps, CheckboxRef, CheckboxSize } from './Checkbox.types'

const sizeClasses: Record<CheckboxSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const iconSizeClasses: Record<CheckboxSize, string> = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-3.5 w-3.5',
}

const baseControl =
  /* Vazio é superfície rebaixada, marcado é tinta cheia — nada de caixinha
   * contornada em cima de fundo claro. */
  'flex shrink-0 items-center justify-center rounded-[4px] border ' +
  'bg-white transition-[color,box-shadow,border-color] duration-200 cursor-pointer'

const controlDefault =
  'border-input-border data-[state=checked]:bg-brand ' +
  'data-[state=checked]:border-brand'

const controlError =
  'border-danger data-[state=checked]:bg-danger data-[state=checked]:border-danger'

const indicatorBase = 'flex items-center justify-center text-white'

/**
 * Checkbox built on top of Ark UI Checkbox.
 *
 * @param size - Size of the checkbox control. Default: `md`
 *
 * @param error - Applies error styles to indicate invalid state
 *
 * @param checked - Controlled checked state (`true`, `false`, or `'indeterminate'`)
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
 */
export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>(
  (
    { size = 'md', error = false, className, onCheckedChange, ...props },
    ref
  ) => (
    <ArkCheckbox.Root
      onCheckedChange={({ checked }) => onCheckedChange?.(checked)}
      {...props}
    >
      <ArkCheckbox.Control
        ref={ref}
        className={mergeClasses(
          baseControl,
          baseFocus,
          baseDisabled,
          sizeClasses[size],
          error ? controlError : controlDefault,
          className
        )}
      >
        <ArkCheckbox.Indicator className={indicatorBase}>
          <svg
            className={iconSizeClasses[size]}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1.5 6 4.5 9.5 10.5 2.5" />
          </svg>
        </ArkCheckbox.Indicator>
      </ArkCheckbox.Control>
      <ArkCheckbox.HiddenInput />
    </ArkCheckbox.Root>
  )
)

Checkbox.displayName = 'Checkbox'
