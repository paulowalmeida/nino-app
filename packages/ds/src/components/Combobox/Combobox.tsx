import { forwardRef, useMemo, useState } from 'react'

import {
  Combobox as ArkCombobox,
  createListCollection,
} from '@ark-ui/react/combobox'
import { Portal } from '@ark-ui/react/portal'

import { baseDisabled } from '@ds/lib/baseClasses'
import { mergeClasses } from '@ds/lib/mergeClasses'

import {
  ComboboxInputRef,
  ComboboxOption,
  ComboboxProps,
  ComboboxSize,
} from './Combobox.types'

const sizeClasses: Record<ComboboxSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const baseInput =
  'w-full rounded-md border bg-white text-gray-900 placeholder:text-gray-400 transition-colors outline-none'

const inputDefault =
  'border-gray-300 focus:ring-2 focus:ring-brand focus:border-brand'

const inputError =
  'aria-[invalid]:border-red-500 aria-[invalid]:focus:ring-red-500 ' +
  'aria-[invalid]:focus:border-red-500 data-[invalid]:border-red-500 ' +
  'data-[invalid]:focus:ring-red-500 data-[invalid]:focus:border-red-500'

const baseContent =
  'z-50 min-w-[var(--reference-width)] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md p-1'

const baseItem =
  'relative flex cursor-default select-none items-center rounded px-3 py-2 text-sm text-gray-900 outline-none transition-colors data-[highlighted]:bg-[color-mix(in_srgb,var(--color-brand)_10%,white)] data-[highlighted]:text-brand data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

const baseEmpty = 'px-3 py-2 text-sm text-gray-400'

function filterOptions(options: ComboboxOption[], query: string) {
  if (!query) return options
  const q = query.toLowerCase()
  return options.filter((option) => option.label.toLowerCase().includes(q))
}

/**
 * Searchable select: filters options as the user types.
 * Renders Ark Combobox. Place inside `FormField` for label + error wiring.
 *
 * @param options - Available options (value, label, optional disabled)
 *
 * @param placeholder - Placeholder shown when the input is empty
 *
 * @param size - Height and padding of the input. Default: `md`
 *
 * @param error - Applies error styles to indicate invalid input
 *
 * @param disabled - Disables the combobox
 *
 * @param value - Controlled selected value
 *
 * @param defaultValue - Uncontrolled initial value
 *
 * @param onValueChange - Fired with the selected value
 *
 * @param emptyMessage - Text shown when no option matches. Default: `Nenhum resultado`
 *
 * @param className - Additional CSS classes merged into the input
 */
export const Combobox = forwardRef<ComboboxInputRef, ComboboxProps>(
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
      emptyMessage = 'Nenhum resultado',
      className,
    },
    ref
  ) => {
    const [query, setQuery] = useState('')

    const filtered = useMemo(
      () => filterOptions(options, query),
      [options, query]
    )

    const collection = useMemo(
      () =>
        createListCollection({
          items: filtered,
          itemToValue: (item) => item.value,
          itemToString: (item) => item.label,
        }),
      [filtered]
    )

    return (
      <ArkCombobox.Root
        collection={collection}
        disabled={disabled}
        value={value !== undefined ? [value] : undefined}
        defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
        onValueChange={({ value: values }) => onValueChange?.(values[0])}
        onInputValueChange={({ inputValue }) => setQuery(inputValue)}
      >
        <ArkCombobox.Control>
          <ArkCombobox.Input
            ref={ref}
            placeholder={placeholder}
            data-invalid={error || undefined}
            aria-invalid={error || undefined}
            className={mergeClasses(
              baseInput,
              baseDisabled,
              sizeClasses[size],
              inputDefault,
              inputError,
              className
            )}
          />
        </ArkCombobox.Control>
        <Portal>
          <ArkCombobox.Positioner>
            <ArkCombobox.Content className={baseContent}>
            <ArkCombobox.Empty className={baseEmpty}>
              {emptyMessage}
            </ArkCombobox.Empty>
            {filtered.map((option) => (
              <ArkCombobox.Item
                key={option.value}
                item={option}
                className={baseItem}
              >
                <ArkCombobox.ItemText>{option.label}</ArkCombobox.ItemText>
              </ArkCombobox.Item>
            ))}
            </ArkCombobox.Content>
          </ArkCombobox.Positioner>
        </Portal>
      </ArkCombobox.Root>
    )
  }
)

Combobox.displayName = 'Combobox'
