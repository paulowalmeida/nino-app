import { PinInput as ArkPinInput } from '@ark-ui/react/pin-input'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { OTPInputProps } from './OTPInput.types'

const baseRoot = 'flex items-center gap-2'

const baseInput =
  'h-12 w-12 rounded-card border border-transparent bg-surface-sunk text-center text-lg font-semibold text-ink outline-none transition-colors placeholder:text-faint focus:border-brand focus:ring-2 focus:ring-brand data-[invalid]:border-danger data-[invalid]:focus:ring-danger data-[complete]:border-brand disabled:pointer-events-none disabled:opacity-50'

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
