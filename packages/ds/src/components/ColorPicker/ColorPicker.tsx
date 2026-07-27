import {
  ColorPicker as ArkColorPicker,
  parseColor,
} from '@ark-ui/react/color-picker'
import { Portal } from '@ark-ui/react/portal'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { ColorPickerProps } from './ColorPicker.types'

const defaultPresets = [
  '#FF6B00',
  '#E8540C',
  '#2563EB',
  '#16A34A',
  '#DC2626',
  '#9333EA',
  '#0891B2',
  '#1A1A2E',
]

const controlClass =
  'inline-flex h-10 items-center gap-2 rounded-card border border-input-border bg-white ' +
  'pl-2 pr-3 transition-colors hover:border-brand focus-within:ring-2 ' +
  'focus-within:ring-brand/25 focus-within:border-brand ' +
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

const triggerClass =
  'inline-flex items-center gap-2 outline-none cursor-pointer'

const swatchClass = 'h-6 w-6 rounded-[4px]'

const valueTextClass = 'text-sm font-medium text-ink tabular-nums'

const contentClass =
  'z-50 w-60 rounded-card border border-line bg-white p-3 shadow-overlay ' +
  'outline-none data-[state=open]:animate-in data-[state=closed]:animate-out ' +
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ' +
  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'

const areaClass = 'h-36 w-full overflow-hidden rounded-card'

const areaThumbClass =
  'h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ' +
  'border-white shadow ring-1 ring-black/20'

const hueTrackClass = 'mt-3 h-3 w-full rounded-full'

const hueThumbClass =
  'h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white shadow ring-1 ring-black/20'

const hexInputClass =
  'mt-3 h-8 w-full rounded-card border border-input-border px-2 text-sm uppercase ' +
  'text-ink outline-none transition-colors focus:ring-2 focus:ring-brand/25 focus:border-brand'

const swatchGroupClass = 'mt-3 flex flex-wrap gap-1.5'

const presetSwatchClass =
  'h-6 w-6 cursor-pointer rounded border border-black/10 outline-none ' +
  'transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2'

/**
 * Color picker for tenant branding — lets the store owner pick their brand
 * color. Wraps Ark `ColorPicker`; emits a hex string.
 *
 * @param value - Controlled hex color
 *
 * @param onValueChange - Fired with the new hex string
 *
 * @param presets - Preset swatches shown below the picker
 */
export function ColorPicker({
  value,
  defaultValue,
  onValueChange,
  presets = defaultPresets,
  disabled,
  className,
}: ColorPickerProps) {
  const valueProps =
    value !== undefined
      ? { value: parseColor(value) }
      : { defaultValue: parseColor(defaultValue ?? '#FF6B00') }

  return (
    <ArkColorPicker.Root
      {...valueProps}
      disabled={disabled}
      onValueChange={(e) => onValueChange?.(e.value.toString('hex'))}
    >
      <ArkColorPicker.Control className={mergeClasses(controlClass, className)}>
        <ArkColorPicker.Trigger className={triggerClass}>
          <ArkColorPicker.ValueSwatch className={swatchClass} />
          <ArkColorPicker.ValueText className={valueTextClass} />
        </ArkColorPicker.Trigger>
      </ArkColorPicker.Control>

      <Portal>
        <ArkColorPicker.Positioner>
          <ArkColorPicker.Content className={contentClass}>
            <ArkColorPicker.Area className={areaClass}>
              <ArkColorPicker.AreaBackground className="h-full w-full" />
              <ArkColorPicker.AreaThumb className={areaThumbClass} />
            </ArkColorPicker.Area>

            <ArkColorPicker.ChannelSlider channel="hue">
              <ArkColorPicker.ChannelSliderTrack className={hueTrackClass} />
              <ArkColorPicker.ChannelSliderThumb className={hueThumbClass} />
            </ArkColorPicker.ChannelSlider>

            <ArkColorPicker.ChannelInput
              channel="hex"
              className={hexInputClass}
            />

            <ArkColorPicker.SwatchGroup className={swatchGroupClass}>
              {presets.map((preset) => (
                <ArkColorPicker.SwatchTrigger
                  key={preset}
                  value={preset}
                  className={presetSwatchClass}
                >
                  <ArkColorPicker.Swatch
                    value={preset}
                    className="h-full w-full rounded"
                  />
                </ArkColorPicker.SwatchTrigger>
              ))}
            </ArkColorPicker.SwatchGroup>
          </ArkColorPicker.Content>
        </ArkColorPicker.Positioner>
      </Portal>

      <ArkColorPicker.HiddenInput />
    </ArkColorPicker.Root>
  )
}

ColorPicker.displayName = 'ColorPicker'
