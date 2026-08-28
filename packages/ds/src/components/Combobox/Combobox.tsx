import { KeyboardEvent, Ref, useMemo, useState } from 'react'

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
  /** Available options (value, label, optional disabled) */
  options: ComboboxOption[]
  /** Placeholder shown when the input is empty */
  placeholder?: string
  /** Height and padding of the input. Default: `md` */
  size?: ComboboxSize
  /** Applies error styles to indicate invalid input */
  error?: boolean
  /** Disables the combobox */
  disabled?: boolean
  /** Controlled selected value */
  value?: string
  /** Uncontrolled initial value */
  defaultValue?: string
  /** Fired with the selected value */
  onValueChange?: (value: string) => void
  /** Text shown when no option matches. Default: `Nenhum resultado` */
  emptyMessage?: string
  /** Additional CSS classes merged into the input */
  className?: string
  /**
   * Validates the input's prospective value before a keystroke is applied
   * — e.g. to keep a time search shaped like `HH:mm`, not just any digits
   * and `:`. Leave it out for a normal free-text search. Paste isn't run
   * through this; pair it with `maxLength` to also cap a paste.
   */
  isValidQuery?: (nextValue: string) => boolean
  /** Caps how many characters the input accepts, including a paste. */
  maxLength?: number
  /**
   * Accessible name for the input when no visible label wraps it (e.g.
   * outside `FormField`)
   */
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
  isValidQuery,
  maxLength,
  ariaLabel,
  ref,
}: ComboboxProps) {
  const [query, setQuery] = useState('')

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isValidQuery || event.key.length !== 1) return

    const input = event.currentTarget
    const nextValue =
      input.value.slice(0, input.selectionStart ?? input.value.length) +
      event.key +
      input.value.slice(input.selectionEnd ?? input.value.length)

    if (!isValidQuery(nextValue)) event.preventDefault()
  }

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
          maxLength={maxLength}
          onKeyDown={handleKeyDown}
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
          {/* `menu-animated-content` é global: os keyframes de abrir e fechar
              vivem em globals.css e não podem virar hash do CSS Module. */}
          <ArkCombobox.Content
            className={mergeClasses(
              'menu-animated-content',
              styles.optionPanel
            )}
          >
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
