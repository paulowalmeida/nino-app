import { forwardRef, useMemo } from 'react'

import { Select as ArkSelect, createListCollection } from '@ark-ui/react/select'
import { Portal } from '@ark-ui/react/portal'

import { baseDisabled, baseFocus } from '@ds/lib/baseClasses'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { SelectProps, SelectSize, SelectTriggerRef } from './Select.types'

const sizeClasses: Record<SelectSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const baseTrigger =
  'w-full flex items-center justify-between gap-2 rounded-md border bg-white text-gray-900 transition-colors outline-none'

const triggerDefault =
  'border-gray-300 focus:ring-2 focus:ring-brand focus:border-brand'

const triggerError =
  'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'

const baseContent =
  'z-50 min-w-[var(--reference-width)] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md p-1'

const baseItem =
  'relative flex cursor-default select-none items-center rounded px-3 py-2 text-sm text-gray-900 outline-none transition-colors data-[highlighted]:bg-[color-mix(in_srgb,var(--color-brand)_10%,white)] data-[highlighted]:text-brand data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

const chevronClass = 'shrink-0 text-gray-400'

export const Select = forwardRef<SelectTriggerRef, SelectProps>(
  (
    {
      options,
      placeholder,
      size = 'md',
      error = false,
      disabled,
      value,
      defaultValue,
      onValueChange,
      className,
    },
    ref
  ) => {
    const collection = useMemo(
      () =>
        createListCollection({
          items: options,
          itemToValue: (item) => item.value,
          itemToString: (item) => item.label,
        }),
      [options]
    )

    return (
      <ArkSelect.Root
        collection={collection}
        disabled={disabled}
        value={value !== undefined ? [value] : undefined}
        defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
        onValueChange={({ value: values }) => onValueChange?.(values[0])}
      >
        <ArkSelect.Control>
          <ArkSelect.Trigger
            ref={ref}
            className={mergeClasses(
              baseTrigger,
              baseFocus,
              baseDisabled,
              sizeClasses[size],
              error ? triggerError : triggerDefault,
              className
            )}
          >
            <ArkSelect.ValueText
              placeholder={placeholder}
              className='data-placeholder-shown:text-gray-400'
            />
            <ArkSelect.Indicator>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={chevronClass}
              >
                <path d='m6 9 6 6 6-6' />
              </svg>
            </ArkSelect.Indicator>
          </ArkSelect.Trigger>
        </ArkSelect.Control>
        <Portal>
          <ArkSelect.Positioner>
            <ArkSelect.Content className={baseContent}>
              {options.map((option) => (
                <ArkSelect.Item
                  key={option.value}
                  item={option}
                  className={baseItem}
                >
                  <ArkSelect.ItemText>{option.label}</ArkSelect.ItemText>
                </ArkSelect.Item>
              ))}
            </ArkSelect.Content>
          </ArkSelect.Positioner>
        </Portal>
        <ArkSelect.HiddenSelect />
      </ArkSelect.Root>
    )
  }
)

Select.displayName = 'Select'
