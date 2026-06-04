import { ButtonHTMLAttributes, forwardRef } from 'react'

import { LoadingDots } from '@ds/components/LoadingDots'
import { Spinner } from '@ds/components/Spinner'
import { baseFocus, baseLayout } from '@ds/lib/baseClasses'
import { mergeClasses } from '@ds/lib/mergeClasses'
import { Slot } from '@radix-ui/react-slot'
import { motion } from 'framer-motion'

import { ButtonProps, ButtonSize, ButtonVariant } from './Button.types'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-brand-foreground hover:bg-brand-hover active:bg-brand-active',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
  outline:
    'border border-gray-300 text-gray-900 bg-transparent hover:bg-gray-50 active:bg-gray-100',
  ghost: 'text-gray-700 bg-transparent hover:bg-gray-100 active:bg-gray-200',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

const baseDisabledStyle = 'disabled:pointer-events-none'
const disabledOpacity = 'opacity-50'

const MotionButton = motion.create('button')

/**
 * Primary action button. Supports visual variants, sizes,
 * loading state, and child element rendering via `asChild`.
 *
 * @param variant - Visual style of the button. Default: `primary`
 *
 * @param size - Height and padding of the button. Default: `md`
 *
 * @param loading - Shows a loading indicator and blocks interaction while an action is in progress
 *
 * @param loadingIndicator - Style of the loading indicator. Default: `spinner`
 *
 * @param asChild - Delegates rendering to the direct child via Radix Slot
 *
 * @param disabled - Disables the button
 *
 * @param className - Additional CSS classes merged with base styles
 *
 * @param onClick - Fired when the button is clicked
 *
 * @param onFocus - Fired when the button receives focus
 *
 * @param onBlur - Fired when the button loses focus
 *
 * @param onMouseEnter - Fired when the pointer enters the button
 *
 * @param onMouseLeave - Fired when the pointer leaves the button
 *
 * @param onKeyDown - Fired when a key is pressed while the button is focused
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingIndicator = 'spinner',
      asChild = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseClassName = mergeClasses(
      baseLayout,
      baseFocus,
      baseDisabledStyle,
      (disabled || loading) && disabledOpacity,
      variantClasses[variant],
      sizeClasses[size],
      className
    )

    if (asChild) {
      return (
        <Slot
          ref={ref}
          disabled={disabled || loading}
          aria-busy={loading || undefined}
          className={baseClassName}
          {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </Slot>
      )
    }

    return (
      <MotionButton
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={baseClassName}
        whileTap={disabled || loading ? {} : { scale: 0.97, opacity: 0.75 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        {...props}
      >
        {loadingIndicator === 'dots' ? (
          <LoadingDots visible={loading} />
        ) : (
          <Spinner visible={loading} />
        )}
        {!loading && children}
      </MotionButton>
    )
  }
)

Button.displayName = 'Button'
