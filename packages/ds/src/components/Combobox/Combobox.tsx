import { KeyboardEvent, Ref, useMemo, useState } from 'react'

import {
  Combobox as ArkCombobox,
  createListCollection,
} from '@ark-ui/react/combobox'
import { Portal } from '@ark-ui/react/portal'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import { Spinner } from '../Spinner/Spinner'
import styles from './Combobox.module.css'
import { ComboboxSize } from './Combobox.types'

type ComboboxOption = {
  value: string
  label: string
  inputLabel?: string
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
  /** Controlled search text */
  inputValue?: string
  /** Uncontrolled initial value */
  defaultValue?: string
  /** Fired with the selected value */
  onValueChange?: (value: string) => void
  /** Fired whenever the user changes the search text */
  onInputValueChange?: (value: string) => void
  /** Text shown when no option matches. Default: `Nenhum resultado` */
  emptyMessage?: string
  /** Shows an inline loading indicator while options are being fetched. */
  loading?: boolean
  /** Keeps server-filtered options intact instead of filtering them again. */
  shouldFilterOptions?: boolean
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
  onBlur?: React.FocusEventHandler<HTMLInputElement>
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
  inputValue,
  defaultValue,
  onValueChange,
  onInputValueChange,
  emptyMessage = 'Nenhum resultado',
  loading = false,
  shouldFilterOptions = true,
  className,
  isValidQuery,
  maxLength,
  ariaLabel,
  onBlur,
  ref,
}: ComboboxProps) {
  const [query, setQuery] = useState('')

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.length !== 1) return

    const input = event.currentTarget
    const nextValue =
      input.value.slice(0, input.selectionStart ?? input.value.length) +
      event.key +
      input.value.slice(input.selectionEnd ?? input.value.length)

    if (isValidQuery && !isValidQuery(nextValue)) event.preventDefault()
  }

  const filtered = useMemo(
    () => (shouldFilterOptions ? filterOptions(options, query) : options),
    [options, query, shouldFilterOptions]
  )

  const collection = useMemo(
    () =>
      createListCollection({
        items: filtered,
        itemToValue: (item) => item.value,
        itemToString: (item) => item.inputLabel ?? item.label,
      }),
    [filtered]
  )

  /* Ark rastreia `value` por identidade: um array recriado a cada render
   * parece "mudar" mesmo com o mesmo conteúdo, e isso faz o Ark reverter o
   * texto digitado de volta para o item selecionado. */
  const selectedValue = useMemo(
    () => (value !== undefined ? [value] : undefined),
    [value]
  )
  const initialValue = useMemo(
    () => (defaultValue !== undefined ? [defaultValue] : undefined),
    [defaultValue]
  )

  return (
    <ArkCombobox.Root
      collection={collection}
      disabled={disabled}
      value={selectedValue}
      inputValue={inputValue}
      defaultValue={initialValue}
      onValueChange={({ value: values }) => onValueChange?.(values[0])}
      onInputValueChange={({ inputValue, reason }) => {
        setQuery(inputValue)
        // WORKAROUND: selecting an item also fires this event (Ark syncs the
        // input text to the chosen item), so a consumer that clears stale
        // selection fields on every text change would erase what it just set.
        if (reason === 'input-change') onInputValueChange?.(inputValue)
      }}
    >
      <ArkCombobox.Control
        className={styles.control}
        data-disabled={disabled || undefined}
        onMouseDownCapture={
          disabled ? (event) => event.preventDefault() : undefined
        }
      >
        <ArkCombobox.Input
          ref={ref}
          placeholder={placeholder}
          maxLength={maxLength}
          onKeyDown={handleKeyDown}
          aria-label={ariaLabel}
          onBlur={onBlur}
          data-invalid={error || undefined}
          aria-invalid={error || undefined}
          className={mergeClasses(
            styles.searchField,
            styles.invalidState,
            sizeClasses[size],
            loading && styles.loadingInput,
            className
          )}
        />
        <span className={styles.loadingIndicator} aria-hidden="true">
          <Spinner visible={loading} size={16} />
        </span>
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
            {!loading && (
              <ArkCombobox.Empty className={styles.emptyMessage}>
                {emptyMessage}
              </ArkCombobox.Empty>
            )}
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
