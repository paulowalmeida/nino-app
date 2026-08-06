import { PinInput as ArkPinInput } from '@ark-ui/react/pin-input'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { OTPInputProps, OTPInputType } from './OTPInput.types'

const baseRoot = 'flex items-center gap-2'

/*
 * Ark validates a paste against `type` before inserting it (numeric here:
 * `/^[0-9]+$/`), with no built-in tolerance — a code copied straight out of
 * the SMS text ("Seu código é 123456") or with a stray space fails that
 * regex and the whole paste gets silently dropped. `sanitizeValue` runs
 * first, so each type strips down to exactly what its own regex accepts.
 */
const sanitizeByType: Record<OTPInputType, (value: string) => string> = {
  numeric: (value) => value.replace(/\D/g, ''),
  alphabetic: (value) => value.replace(/[^a-zA-Z]/g, ''),
  alphanumeric: (value) => value.replace(/[^a-zA-Z0-9]/g, ''),
}

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
      sanitizeValue={sanitizeByType[type]}
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
