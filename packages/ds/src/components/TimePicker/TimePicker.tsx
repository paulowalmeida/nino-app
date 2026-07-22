import { useMemo } from 'react'

import { Combobox } from '@ds/components/Combobox'

import { TimePickerProps } from './TimePicker.types'

const pad = (value: number): string => String(value).padStart(2, '0')

function buildOptions(step: number) {
  const options = []
  for (let minutes = 0; minutes < 24 * 60; minutes += step) {
    const label = `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
    options.push({ value: label, label })
  }
  return options
}

/**
 * Time-of-day picker: a searchable list of `HH:mm` slots (type "14" to jump
 * to 14:00). Renders `Combobox` — no free typing outside the step grid, so
 * the value sent to the API is always a valid, predictable time.
 *
 * @param step - Minutes between each option in the list. Default: `15`
 *
 * @param placeholder - Placeholder shown when empty
 *
 * @param size - Height and padding of the input. Default: `md`
 *
 * @param error - Applies error styles to indicate invalid input
 *
 * @param disabled - Disables the picker
 *
 * @param value - Controlled selected time, `HH:mm`
 *
 * @param defaultValue - Uncontrolled initial time, `HH:mm`
 *
 * @param onValueChange - Fired with the selected time, `HH:mm`
 *
 * @param className - Additional CSS classes merged into the input
 *
 * @param ariaLabel - Accessible name when no visible label wraps it
 */
export const TimePicker = ({
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
}: TimePickerProps) => {
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
      ariaLabel={ariaLabel}
    />
  )
}
