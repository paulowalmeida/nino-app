import { type ChangeEvent, forwardRef } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { NumberInputProps, NumberInputSize } from './NumberInput.types'

const sizeClasses: Record<NumberInputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const base =
  'w-full rounded-card border bg-white text-ink outline-none transition-[color,box-shadow,border-color] duration-200 placeholder:text-faint tabular-nums focus:border-brand focus:ring-1 focus:ring-inset focus:ring-brand disabled:pointer-events-none disabled:opacity-50'

const variantDefault = 'border-input-border'
const variantError =
  'border-danger focus:border-danger focus:ring-1 focus:ring-inset ' +
  'focus:ring-danger'

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
