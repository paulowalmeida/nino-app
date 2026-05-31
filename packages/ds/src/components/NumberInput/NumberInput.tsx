import { forwardRef } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { NumberInputProps, NumberInputSize } from './NumberInput.types'

const sizeClasses: Record<NumberInputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const base =
  'w-full rounded-md border bg-white text-gray-900 outline-none transition-colors placeholder:text-gray-400 tabular-nums focus:ring-2 focus:ring-brand focus:border-brand disabled:pointer-events-none disabled:opacity-50'

const variantDefault = 'border-gray-300'
const variantError = 'border-red-500 focus:ring-red-500 focus:border-red-500'

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
  ) => (
    <input
      ref={ref}
      type='number'
      name={name}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onValueChange?.(e.target.valueAsNumber)}
      className={mergeClasses(
        base,
        sizeClasses[size],
        error ? variantError : variantDefault,
        className
      )}
    />
  )
)

NumberInput.displayName = 'NumberInput'
