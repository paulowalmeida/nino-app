import { RadioGroup as ArkRadioGroup } from '@ark-ui/react/radio-group'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { RadioGroupProps } from './RadioGroup.types'

const baseRoot = 'flex gap-3'
const rootVertical = 'flex-col'
const rootHorizontal = 'flex-row flex-wrap'

const baseControl =
  'h-4 w-4 shrink-0 rounded-full border border-gray-300 flex items-center justify-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand data-[state=checked]:border-brand data-[state=checked]:bg-brand disabled:cursor-not-allowed disabled:opacity-50'

const baseIndicatorDot = 'h-1.5 w-1.5 rounded-full bg-white'

const baseLabelText =
  'text-sm text-gray-700 leading-none cursor-pointer'

const baseOptionWrapper = 'flex items-center gap-2 cursor-pointer'

export function RadioGroup({
  options,
  orientation = 'vertical',
  className,
  onValueChange,
  ...props
}: RadioGroupProps) {
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
          className={baseOptionWrapper}
        >
          <ArkRadioGroup.ItemControl className={baseControl}>
            <ArkRadioGroup.Indicator>
              <span className={baseIndicatorDot} />
            </ArkRadioGroup.Indicator>
          </ArkRadioGroup.ItemControl>
          <ArkRadioGroup.ItemText className={baseLabelText}>
            {option.label}
          </ArkRadioGroup.ItemText>
          <ArkRadioGroup.ItemHiddenInput />
        </ArkRadioGroup.Item>
      ))}
    </ArkRadioGroup.Root>
  )
}
