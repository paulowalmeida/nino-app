import { RadioGroup as ArkRadioGroup } from '@ark-ui/react/radio-group'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { RadioGroupProps, RadioGroupVariant } from './RadioGroup.types'

const baseRoot = 'flex gap-3'
const rootVertical = 'flex-col'
const rootHorizontal = 'flex-row flex-wrap'

const baseControl =
  'h-4 w-4 shrink-0 rounded-full border border-input-border bg-white ' +
  'flex items-center justify-center outline-none transition-[color,box-shadow,border-color] duration-200 ' +
  'focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:outline-offset-2 data-[state=checked]:border-brand ' +
  'data-[state=checked]:bg-brand disabled:cursor-not-allowed ' +
  'disabled:opacity-50'

const baseIndicatorDot = 'h-1.5 w-1.5 rounded-full bg-white'

const baseLabelText = 'text-sm text-body leading-none cursor-pointer'

/* No modo card o rótulo deixa de ser `leading-none`: ele passa a dividir a
 * linha com a descrição, e o texto colado no topo desalinharia do radio. */
const cardLabelText = 'block text-sm font-semibold text-ink cursor-pointer'

const descriptionText = 'mt-0.5 block text-xs leading-relaxed text-faint'

const wrapperClasses: Record<RadioGroupVariant, string> = {
  default: 'flex items-center gap-2 cursor-pointer',
  card:
    'flex flex-1 items-start gap-2.5 cursor-pointer rounded-card border ' +
    'border-line/60 bg-white p-3 transition-colors ' +
    'hover:border-brand/40 data-[state=checked]:border-brand ' +
    'data-[state=checked]:bg-brand-soft ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
}

/**
 * Single choice out of a short list.
 *
 * @param options - Choices, each with `value`, `label` and optional
 * `description`
 *
 * @param variant - `card` gives each option its own surface. Default:
 * `default`
 *
 * @param orientation - Stacking direction. Default: `vertical`
 *
 * @param onValueChange - Fired with the selected value
 *
 * @example
 * <RadioGroup options={[{ value: 'pix', label: 'Pix' }]} />
 *
 * @example
 * <RadioGroup
 *   variant="card"
 *   orientation="horizontal"
 *   options={[
 *     { value: 'DELIVERY', label: 'Entrega', description: 'Chega em ~40 min' },
 *     { value: 'PICKUP', label: 'Retirada', description: 'Você busca na loja' },
 *   ]}
 * />
 */
export function RadioGroup({
  options,
  variant = 'default',
  orientation = 'vertical',
  className,
  onValueChange,
  ...props
}: RadioGroupProps) {
  const isCard = variant === 'card'

  return (
    <ArkRadioGroup.Root
      className={mergeClasses(
        baseRoot,
        orientation === 'vertical' ? rootVertical : rootHorizontal,
        className
      )}
      onValueChange={({ value }) => value !== null && onValueChange?.(value)}
      orientation={orientation}
      {...props}
    >
      {options.map((option) => (
        <ArkRadioGroup.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={wrapperClasses[variant]}
        >
          <ArkRadioGroup.ItemControl
            className={mergeClasses(baseControl, isCard && 'mt-0.5')}
          >
            <ArkRadioGroup.Indicator>
              <span className={baseIndicatorDot} />
            </ArkRadioGroup.Indicator>
          </ArkRadioGroup.ItemControl>

          {isCard ? (
            <span className="min-w-0">
              <ArkRadioGroup.ItemText className={cardLabelText}>
                {option.label}
              </ArkRadioGroup.ItemText>
              {option.description && (
                <span className={descriptionText}>{option.description}</span>
              )}
            </span>
          ) : (
            <ArkRadioGroup.ItemText className={baseLabelText}>
              {option.label}
            </ArkRadioGroup.ItemText>
          )}

          <ArkRadioGroup.ItemHiddenInput />
        </ArkRadioGroup.Item>
      ))}
    </ArkRadioGroup.Root>
  )
}
