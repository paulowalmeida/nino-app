import { FocusEventHandler, Ref } from 'react'

import { Switch as ArkSwitch } from '@ark-ui/react/switch'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Switch.module.css'

type SwitchSize = 'sm' | 'md'

type SwitchProps = {
  /** `sm` or `md` (default) */
  size?: SwitchSize
  /**
   * Controlled state. Leave it out and pass `defaultChecked` to let the
   * component keep its own
   */
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  id?: string
  disabled?: boolean
  name?: string
  value?: string
  className?: string
  /** Fired when focus leaves the control, for a form that validates on blur */
  onBlur?: FocusEventHandler<HTMLInputElement>
  /**
   * Points at the hidden input, which is what takes focus — a form library
   * moving focus to the first invalid field lands here
   */
  ref?: Ref<HTMLInputElement>
}

const rootSizeClasses: Record<SwitchSize, string> = {
  sm: styles.trackSizeSmall,
  md: styles.trackSizeMedium,
}

const thumbSizeClasses: Record<SwitchSize, string> = {
  sm: styles.knobSizeSmall,
  md: styles.knobSizeMedium,
}

/**
 * Toggle that takes effect the moment it is flipped — the store opening,
 * an item leaving the menu.
 *
 * That is what sets it apart from `Checkbox`: a checkbox is an answer that
 * only counts when the form is submitted, a switch acts at once. If what
 * you have is a choice to be confirmed later, it is a checkbox.
 *
 * It has no label of its own: wrap it in `FormField` with
 * `orientation="horizontal"`, which ties the text to the control and makes
 * the text clickable too.
 *
 * ```tsx
 * <FormField label="Loja aberta" orientation="horizontal">
 *   <Switch checked={isOpen} onCheckedChange={setOpen} />
 * </FormField>
 * ```
 */
export function Switch({
  size = 'md',
  className,
  onCheckedChange,
  checked,
  defaultChecked,
  onBlur,
  ref,
  ...props
}: SwitchProps) {
  return (
    <ArkSwitch.Root
      className={styles.switch}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={({ checked: isChecked }) => onCheckedChange?.(isChecked)}
      {...props}
    >
      <ArkSwitch.Control
        className={mergeClasses(styles.track, rootSizeClasses[size], className)}
      >
        <ArkSwitch.Thumb
          className={mergeClasses(styles.knob, thumbSizeClasses[size])}
        />
      </ArkSwitch.Control>
      <ArkSwitch.HiddenInput ref={ref} onBlur={onBlur} />
    </ArkSwitch.Root>
  )
}
