import { type ChangeEvent, forwardRef } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { NumberInputProps, NumberInputSize } from './NumberInput.types'

const sizeClasses: Record<NumberInputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const base =
  'w-full rounded-card border bg-surface-sunk text-ink outline-none transition-colors placeholder:text-faint tabular-nums focus:ring-2 focus:ring-brand focus:border-brand disabled:pointer-events-none disabled:opacity-50'

const variantDefault = 'border-transparent'
const variantError = 'border-danger focus:ring-danger focus:border-danger'

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
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
    },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.valueAsNumber
      if (!isNaN(v)) onValueChange?.(v)
    }

    return (
      <input
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
        onChange={handleChange}
        className={mergeClasses(
          base,
          sizeClasses[size],
          error ? variantError : variantDefault,
          className
        )}
      />
    )
  }
)

NumberInput.displayName = 'NumberInput'
