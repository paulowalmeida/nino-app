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
  secondary: 'bg-sand text-ink hover:bg-sand-deep active:bg-line',
  outline:
    'border border-line text-ink bg-transparent hover:bg-cream ' +
    'active:bg-cream-deep',
  ghost: 'text-body bg-transparent hover:bg-cream active:bg-cream-deep',
  /* Sem halo colorido: sobre o laranja da marca, o glow virava um segundo
   * botão desfocado atrás do primeiro. */
  inverse:
    'bg-paper text-brand-strong hover:bg-cream active:bg-cream-deep ' +
    'shadow-card',
  inverseOutline:
    'border-[1.5px] border-white/55 text-white bg-transparent hover:bg-white hover:text-brand-strong hover:border-white',
  danger:
    'text-subtle bg-transparent hover:bg-danger-surface hover:text-danger ' +
    'active:bg-danger-surface',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-10 w-10 shrink-0 p-0',
}

const baseDisabledStyle = 'disabled:pointer-events-none'

/**
 * Desligado é superfície apagada, não CTA translúcido: laranja de marca a
 * 50% sobre cream continua lendo como botão vivo — a pessoa clica, nada
 * acontece e a culpa parece ser do sistema. Variante com preenchimento
 * troca a tinta por `sand`; as de fundo transparente (outline, ghost) já
 * comunicam pelo apagamento e mantêm a opacidade.
 */
const FILLED: ButtonVariant[] = ['primary', 'secondary', 'inverse']

const disabledStyle = (variant: ButtonVariant): string =>
  FILLED.includes(variant) ? 'bg-sand text-subtle shadow-none' : 'opacity-50'

/** Carregando não é desligado: a ação está em curso, a tinta continua. */
const loadingOpacity = 'opacity-50'

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
      variantClasses[variant],
      sizeClasses[size],
      /* depois da variante: é ela que o estado desligado precisa sobrescrever */
      loading ? loadingOpacity : disabled && disabledStyle(variant),
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
