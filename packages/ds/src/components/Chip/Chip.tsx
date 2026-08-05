import { forwardRef } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { ChipProps } from './Chip.types'

/* Pílula neutra em repouso, marca quando escolhida — o mesmo par de estados
 * em toda escolha exclusiva ou liga/desliga do app: categoria, etapa da
 * fila, forma de pagamento. */
const baseChip =
  'inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full ' +
  'border border-sand bg-brand-foreground px-4 py-2 text-sm font-semibold ' +
  'text-subtle transition-colors duration-200 hover:border-brand/30 ' +
  'hover:text-body focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-brand focus-visible:ring-offset-2'

const selectedChip = 'border-brand/40 bg-brand/10 text-brand-strong'

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
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ variant, selected, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role={variant === 'tab' ? 'tab' : undefined}
      aria-selected={variant === 'tab' ? selected : undefined}
      aria-pressed={variant === 'toggle' ? selected : undefined}
      className={mergeClasses(baseChip, selected && selectedChip, className)}
      {...props}
    >
      {children}
    </button>
  )
)

Chip.displayName = 'Chip'
