import { useMemo } from 'react'

import { Combobox } from '@ds/components/Combobox/Combobox'
import { ComboboxSize } from '@ds/components/Combobox/Combobox.types'

type TimePickerProps = {
  /**
   * Minutes between one slot and the next. Default: `15` — a whole day at
   * that step is 96 options, which is why the list searches
   */
  step?: number
  placeholder?: string
  /** Height and padding, matching the other fields. Default: `md` */
  size?: ComboboxSize
  error?: boolean
  disabled?: boolean
  /**
   * Selected time as `HH:mm`. Leave it out and pass `defaultValue` to let the
   * component keep its own
   */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  /** Accessible name, for when no visible label wraps it */
  ariaLabel?: string
}

const pad = (value: number): string => String(value).padStart(2, '0')

/** Keeps a typed search shaped like `HH:mm`: digits and `:` only, at most
 * 4 digits and one `:`. The committed value still only ever comes from
 * picking a grid slot, so this only guards what the search can look like. */
const isValidTimeQuery = (value: string): boolean => {
  if (!/^[\d:]*$/.test(value)) return false
  const digitCount = value.replace(/:/g, '').length
  const colonCount = value.length - digitCount
  return digitCount <= 4 && colonCount <= 1
}

const buildOptions = (step: number) => {
  const options = []
  for (let minutes = 0; minutes < 24 * 60; minutes += step) {
    const label = `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
    options.push({ value: label, label })
  }
  return options
}

/**
 * Time of day picked from a searchable list of `HH:mm` slots — typing "14"
 * jumps to 14:00.
 *
 * It is a `Combobox` underneath, and there is no free typing outside the
 * grid of slots: whatever reaches the API is always a valid time, so no
 * screen has to guard against "24:71" or "8h".
 *
 * ```tsx
 * <FormField label="Abre às">
 *   <TimePicker value={opensAt} onValueChange={setOpensAt} step={30} />
 * </FormField>
 * ```
 */
export function TimePicker({
  step = 15,
  placeholder = '--:--',
  size = 'md',
  error = false,
  disabled,
  value,
  defaultValue,
  onValueChange,
  className,
  ariaLabel,
}: TimePickerProps) {
  const options = useMemo(() => buildOptions(step), [step])

  return (
    <Combobox
      options={options}
      placeholder={placeholder}
      size={size}
      error={error}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      emptyMessage="Nenhum horário encontrado"
      className={className}
      isValidQuery={isValidTimeQuery}
      maxLength={5}
      ariaLabel={ariaLabel}
    />
  )
}
