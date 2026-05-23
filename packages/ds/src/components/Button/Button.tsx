import { ButtonHTMLAttributes, ComponentType, forwardRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { motion } from 'framer-motion'

import { baseDisabled, baseFocus, baseLayout } from '@ds/lib/baseClasses'
import { mergeClasses } from '@ds/lib/mergeClasses'
import { Spinner } from '@ds/components/Spinner'
import { ButtonProps, ButtonSize, ButtonVariant } from './Button.types'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-brand-foreground hover:bg-brand-hover active:bg-brand-active',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
  outline:
    'border border-gray-300 text-gray-900 bg-transparent hover:bg-gray-50 active:bg-gray-100',
  ghost: 'text-gray-700 bg-transparent hover:bg-gray-100 active:bg-gray-200',
  destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}


const MotionButton = motion.create('button')

// Slot não declara props de button no tipo, mas as repassa ao filho em runtime
const SlotButton = Slot as ComponentType<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: React.Ref<HTMLButtonElement>
  }
>

/**
 * Primary action button. Supports visual variants, sizes,
 * loading state, and child element rendering via `asChild`.
 *
 * @param variant - Visual style of the button. Default: `primary`
 * @param size - Height and padding of the button. Default: `md`
 * @param loading - Shows a spinner and blocks interaction while an action is in progress
 * @param asChild - Delegates rendering to the direct child via Radix Slot
 * @param disabled - Disables the button
 * @param className - Additional CSS classes merged with base styles
 *
 * @param onClick - Fired when the button is clicked
 * @param onFocus - Fired when the button receives focus
 * @param onBlur - Fired when the button loses focus
 * @param onMouseEnter - Fired when the pointer enters the button
 * @param onMouseLeave - Fired when the pointer leaves the button
 * @param onKeyDown - Fired when a key is pressed while the button is focused
 *
 * @example
 * <Button variant="primary" onClick={handleSubmit}>Confirm</Button>
 * <Button loading>Saving...</Button>
 * <Button asChild><a href="/route">See more</a></Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      asChild = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    const baseClassName = mergeClasses(
      baseLayout,
      baseFocus,
      baseDisabled,
      variantClasses[variant],
      sizeClasses[size],
      className
    )

    if (asChild) {
      return (
        <SlotButton
          ref={ref}
          disabled={isDisabled}
          aria-busy={loading || undefined}
          className={baseClassName}
          {...props}
        >
          {children}
        </SlotButton>
      )
    }

    return (
      <MotionButton
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={baseClassName}
        whileTap={isDisabled ? {} : { scale: 0.97, opacity: 0.75 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        {...props}
      >
        <Spinner visible={loading} />
        {children}
      </MotionButton>
    )
  }
)

Button.displayName = 'Button'
