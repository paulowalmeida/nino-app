import { ButtonHTMLAttributes, Ref } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Chip.module.css'

type ChipVariant = 'tab' | 'toggle'

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'role'> & {
  /**
   * `tab` marks the chip as one of a `role="tablist"` group — exclusive
   * choice, exposed via `aria-selected`. `toggle` is a standalone on/off
   * chip, exposed via `aria-pressed`.
   */
  variant: ChipVariant
  selected: boolean
  ref?: Ref<HTMLButtonElement>
}

/**
 * Pill-shaped choice control. Two flavors of the same shape: `tab` for an
 * exclusive choice inside a `role="tablist"` group, `toggle` for a
 * standalone on/off chip.
 *
 * @param variant - `tab` (exposes `aria-selected`) or `toggle` (exposes
 * `aria-pressed`)
 *
 * @param selected - Whether the chip is the current choice
 *
 * @param className - Additional CSS classes merged with base styles
 *
 * @example
 * <div role="tablist">
 *   <Chip variant="tab" selected={value === 'a'} onClick={() => onChange('a')}>
 *     Categoria A
 *   </Chip>
 * </div>
 *
 * @example
 * <Chip variant="toggle" selected={isOn} onClick={() => setIsOn(!isOn)}>
 *   Pix
 * </Chip>
 */
export function Chip({
  variant,
  selected,
  className,
  children,
  ref,
  ...props
}: ChipProps) {
  return (
    <button
      ref={ref}
      type="button"
      role={variant === 'tab' ? 'tab' : undefined}
      aria-selected={variant === 'tab' ? selected : undefined}
      aria-pressed={variant === 'toggle' ? selected : undefined}
      className={mergeClasses(
        styles.chip,
        selected ? styles.selected : styles.resting,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
