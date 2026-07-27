import { forwardRef, useMemo } from 'react'

import { Portal } from '@ark-ui/react/portal'
import { createListCollection, Select as ArkSelect } from '@ark-ui/react/select'
import { baseDisabled, baseFocus } from '@ds/lib/baseClasses'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { SelectProps, SelectSize, SelectTriggerRef } from './Select.types'

const sizeClasses: Record<SelectSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const baseTrigger =
  'w-full flex cursor-pointer items-center justify-between gap-2 rounded-card border bg-white text-ink transition-[color,box-shadow,border-color] duration-200 outline-none'

const triggerDefault =
  'border-input-border focus:border-brand focus:ring-1 focus:ring-inset focus:ring-brand'

const triggerError =
  'border-danger focus:border-danger focus:ring-1 focus:ring-inset focus:ring-danger'

/* Mesmo teto do Combobox: o painel rola por dentro em vez de estourar a
 * viewport. */
const baseContent =
  'z-50 min-w-[var(--reference-width)] max-h-[min(18rem,var(--available-height))] ' +
  'overflow-y-auto overscroll-contain scrollbar-slim rounded-card ' +
  'bg-white shadow-overlay p-1'

const baseItem =
  'relative flex cursor-default select-none items-center rounded px-3 py-2 text-sm text-ink outline-none transition-[color,box-shadow,border-color] duration-200 data-[highlighted]:bg-[color-mix(in_srgb,var(--color-brand)_10%,white)] data-[highlighted]:text-brand data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

const chevronClass = 'shrink-0 text-faint'

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
              className="data-placeholder-shown:text-faint"
            />
            <ArkSelect.Indicator>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={chevronClass}
              >
                <path d="m6 9 6 6 6-6" />
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
