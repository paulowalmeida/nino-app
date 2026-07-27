import { PinInput as ArkPinInput } from '@ark-ui/react/pin-input'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { OTPInputProps } from './OTPInput.types'

const baseRoot = 'flex items-center gap-2'

const baseInput =
  'h-12 w-12 rounded-card border border-input-border bg-white text-center text-lg font-semibold text-ink outline-none transition-[color,box-shadow,border-color] duration-200 placeholder:text-faint focus:border-brand focus:ring-1 focus:ring-inset focus:ring-brand data-[invalid]:border-danger data-[invalid]:focus:ring-danger data-[invalid]:focus:border-danger data-[complete]:border-brand disabled:pointer-events-none disabled:opacity-50'

export function OTPInput({
  length = 6,
  value,
  onValueChange,
  onValueComplete,
  placeholder = '○',
  type = 'numeric',
  otp = false,
  disabled,
  invalid,
  className,
}: OTPInputProps) {
  return (
    <ArkPinInput.Root
      value={value}
      onValueChange={({ value: v }) => onValueChange?.(v)}
      onValueComplete={({ valueAsString }) => onValueComplete?.(valueAsString)}
      placeholder={placeholder}
      type={type}
      otp={otp}
      disabled={disabled}
      invalid={invalid}
      className={mergeClasses(baseRoot, className)}
    >
      {Array.from({ length }).map((_, i) => (
        <ArkPinInput.Input key={i} index={i} className={baseInput} />
      ))}
      <ArkPinInput.HiddenInput />
    </ArkPinInput.Root>
  )
}

OTPInput.displayName = 'OTPInput'
