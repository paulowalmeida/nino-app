import { Slider as ArkSlider } from '@ark-ui/react/slider'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { SliderProps } from './Slider.types'

const baseControl = 'relative flex w-full items-center py-2'
const baseTrack = 'relative h-1.5 w-full grow rounded-full bg-surface-mute'
const baseRange = 'absolute h-full rounded-full bg-brand'
const baseThumb =
  'block size-4 rounded-full bg-brand shadow-card outline-none ' +
  'transition-shadow focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:outline-offset-2 data-[disabled]:opacity-50'
const baseLabel =
  'flex items-center justify-between text-sm font-medium text-body'
const baseValue = 'text-sm text-subtle tabular-nums'

/**
 * Slider for numeric values (price, quantity, percentage).
 * Wraps Ark Slider. Range and thumb use the tenant brand color.
 *
 * @param value - Controlled current value
 *
 * @param onValueChange - Fired with the new value
 *
 * @param min - Minimum value. Default: 0
 *
 * @param max - Maximum value. Default: 100
 *
 * @param step - Step increment. Default: 1
 *
 * @param label - Label displayed above the slider
 *
 * @param showValue - Shows the current value next to the label
 */
export function Slider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  label,
  showValue,
  className,
}: SliderProps) {
  return (
    <ArkSlider.Root
      value={value !== undefined ? [value] : undefined}
      defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
      onValueChange={({ value: v }) => onValueChange?.(v[0])}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={mergeClasses('w-full', className)}
    >
      {(label || showValue) && (
        <ArkSlider.Label className={baseLabel}>
          <span>{label}</span>
          {showValue && <ArkSlider.ValueText className={baseValue} />}
        </ArkSlider.Label>
      )}
      <ArkSlider.Control className={baseControl}>
        <ArkSlider.Track className={baseTrack}>
          <ArkSlider.Range className={baseRange} />
        </ArkSlider.Track>
        <ArkSlider.Thumb index={0} className={baseThumb}>
          <ArkSlider.HiddenInput />
        </ArkSlider.Thumb>
      </ArkSlider.Control>
    </ArkSlider.Root>
  )
}

Slider.displayName = 'Slider'
