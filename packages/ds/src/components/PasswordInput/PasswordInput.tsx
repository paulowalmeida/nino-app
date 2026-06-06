import { forwardRef } from 'react'

import { PasswordInput as ArkPasswordInput } from '@ark-ui/react/password-input'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { PasswordInputProps, PasswordInputSize } from './PasswordInput.types'

const sizeClasses: Record<PasswordInputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const baseControl =
  'flex items-center gap-2 w-full rounded-md border bg-white transition-colors ' +
  'focus-within:ring-2 focus-within:ring-brand/25 focus-within:border-brand'

const controlDefault = 'border-gray-300'

const controlError =
  'border-red-500 focus-within:ring-red-500/25 focus-within:border-red-500'

const baseInput =
  'flex-1 min-w-0 bg-transparent outline-none text-gray-900 placeholder:text-gray-400'

const triggerClass =
  'shrink-0 text-gray-400 transition-colors outline-none cursor-pointer ' +
  'hover:text-gray-600 focus-visible:text-brand disabled:pointer-events-none'

const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
)

/**
 * Password field with a built-in visibility toggle (Ark `PasswordInput`).
 * Forwards the ref and native input props, so it's a drop-in for
 * react-hook-form `register` — just like `Input`.
 *
 * @param size - Height and padding of the field. Default: `md`
 *
 * @param error - Applies error styles to indicate invalid input
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ size = 'md', error = false, className, disabled, ...props }, ref) => (
    <ArkPasswordInput.Root invalid={error} disabled={disabled}>
      <ArkPasswordInput.Control
        className={mergeClasses(
          baseControl,
          error ? controlError : controlDefault,
          sizeClasses[size],
          className
        )}
      >
        <ArkPasswordInput.Input ref={ref} className={baseInput} {...props} />
        <ArkPasswordInput.VisibilityTrigger
          className={triggerClass}
          aria-label="Mostrar ou ocultar senha"
        >
          <ArkPasswordInput.Indicator fallback={<EyeIcon />}>
            <EyeOffIcon />
          </ArkPasswordInput.Indicator>
        </ArkPasswordInput.VisibilityTrigger>
      </ArkPasswordInput.Control>
    </ArkPasswordInput.Root>
  )
)

PasswordInput.displayName = 'PasswordInput'
