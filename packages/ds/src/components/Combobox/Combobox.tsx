import { Ref, useMemo, useState } from 'react'

import {
  Combobox as ArkCombobox,
  createListCollection,
} from '@ark-ui/react/combobox'
import { Portal } from '@ark-ui/react/portal'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Combobox.module.css'
import { ComboboxSize } from './Combobox.types'

type ComboboxOption = {
  value: string
  label: string
  disabled?: boolean
}

type ComboboxProps = {
  options: ComboboxOption[]
  placeholder?: string
  size?: ComboboxSize
  error?: boolean
  disabled?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  emptyMessage?: string
  className?: string
  ariaLabel?: string
  ref?: Ref<HTMLInputElement>
}

const sizeClasses: Record<ComboboxSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
}

const filterOptions = (options: ComboboxOption[], query: string) => {
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
 * @param emptyMessage - Text shown when no option matches. Default: `Nenhum
 * resultado`
 *
 * @param className - Additional CSS classes merged into the input
 *
 * @param ariaLabel - Accessible name for the input when no visible label
 * wraps it (e.g. outside `FormField`)
 */
export function Combobox({
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
  ariaLabel,
  ref,
}: ComboboxProps) {
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
          aria-label={ariaLabel}
          data-invalid={error || undefined}
          aria-invalid={error || undefined}
          className={mergeClasses(
            styles.searchField,
            styles.invalidState,
            sizeClasses[size],
            className
          )}
        />
      </ArkCombobox.Control>
      <Portal>
        <ArkCombobox.Positioner>
          <ArkCombobox.Content className={styles.optionPanel}>
            <ArkCombobox.Empty className={styles.emptyMessage}>
              {emptyMessage}
            </ArkCombobox.Empty>
            {filtered.map((option) => (
              <ArkCombobox.Item
                key={option.value}
                item={option}
                className={styles.option}
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
