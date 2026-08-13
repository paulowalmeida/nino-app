import { ChangeEvent, Ref } from 'react'

import { Input } from '../Input/Input'
import { InputSize } from '../Input/Input.types'
import styles from './NumberInput.module.css'

type NumberInputProps = {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  name?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: InputSize
  className?: string
  ref?: Ref<HTMLInputElement>
}

/**
 * Numeric field with the browser's own steppers.
 *
 * It is the `Input` underneath, so height, states and the invalid style come
 * from one place — what it adds is the number: `onValueChange` hands over a
 * number instead of a string, and the digits line up in columns, which is
 * what makes a list of prices readable.
 *
 * @param onValueChange - Called with the number. An empty or half-typed
 * field (`-`, `1e`) does not call it, so it never reports `NaN`
 *
 * @param step - How much each stepper press moves. Default: `1`
 *
 * @example
 * <NumberInput value={qty} onValueChange={setQty} min={1} />
 */
export function NumberInput({
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  name,
  placeholder,
  disabled,
  error = false,
  size = 'md',
  className,
  ref,
}: NumberInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const typed = event.target.valueAsNumber
    if (!Number.isNaN(typed)) onValueChange?.(typed)
  }

  return (
    <Input
      ref={ref}
      type="number"
      name={name}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      size={size}
      onChange={handleChange}
      className={`${styles.tabularDigits} ${className ?? ''}`}
    />
  )
}
