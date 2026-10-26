import { ButtonHTMLAttributes, ReactNode, Ref } from 'react'

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
  /** Whether the chip is the current choice */
  selected: boolean
  /** Removes the outline while keeping the chip's interaction states. Defaults to true. */
  borderless?: boolean
  /** Content rendered before the chip label, such as an icon or emoji */
  leadingIcon?: ReactNode
  /** Content rendered after the chip label, such as a chevron */
  trailingIcon?: ReactNode
  ref?: Ref<HTMLButtonElement>
}

/**
 * Pill-shaped choice control. Two flavors of the same shape: `tab` for an
 * exclusive choice inside a `role="tablist"` group, `toggle` for a
 * standalone on/off chip.
 *
 * ```tsx
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
 *
 * - `variant` — `tab` (exposes `aria-selected`) or `toggle` (exposes `aria-pressed`)
 * - `borderless` — Removes the outline; defaults to `true`. Pass `false` for an outlined chip
 * - `className` — Additional CSS classes merged with base styles
 * - `leadingIcon` / `trailingIcon` — Optional content beside the label
 * ```
 */
export function Chip({
  variant,
  selected,
  borderless = true,
  leadingIcon,
  trailingIcon,
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
        borderless ? styles.borderless : styles.outlined,
        selected ? styles.selected : styles.resting,
        className
      )}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
}
