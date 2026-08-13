import { ButtonHTMLAttributes, Ref } from 'react'

import { LoadingDots } from '@ds/components/LoadingDots/LoadingDots'
import { Slot } from '@ds/components/Slot/Slot'
import { Spinner } from '@ds/components/Spinner/Spinner'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Button.module.css'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'inverse'
  | 'inverseOutline'
  | 'danger'

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>
  /** Visual style of the button. Default: `primary` */
  variant?: ButtonVariant
  /** Height and padding of the button. Default: `md` */
  size?: ButtonSize
  /** Shows a loading indicator and blocks interaction while an action is in progress */
  loading?: boolean
  /** Loading indicator style. Default: `spinner` */
  loadingIndicator?: 'spinner' | 'dots'
  /**
   * Delegates rendering to the direct child via `Slot`.
   * Useful for rendering the Button as `<a>`, `<Link>`, or another element.
   * @example
   * <Button asChild><a href="/route">See more</a></Button>
   */
  asChild?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  outline: styles.variantOutline,
  ghost: styles.variantGhost,
  inverse: styles.variantInverse,
  inverseOutline: styles.variantInverseOutline,
  danger: styles.variantDanger,
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
  icon: styles.sizeIcon,
}

const FILLED: ButtonVariant[] = ['primary', 'secondary', 'inverse', 'danger']

const disabledStyle = (variant: ButtonVariant): string =>
  FILLED.includes(variant) ? styles.disabledFilled : styles.disabledTransparent

/**
 * Primary action button. Supports visual variants, sizes,
 * loading state, and child element rendering via `asChild`.
 *
 * @param variant - Visual style of the button. Default: `primary`
 *
 * @param size - Height and padding of the button. Default: `md`
 *
 * @param loading - Shows a loading indicator and blocks interaction while
 * an action is in progress
 *
 * @param loadingIndicator - Style of the loading indicator. Default: `spinner`
 *
 * @param asChild - Delegates rendering to the direct child via `Slot`
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
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingIndicator = 'spinner',
  asChild = false,
  disabled,
  className,
  children,
  ref,
  ...props
}: ButtonProps) {
  const isMuted = !!disabled && !loading

  const baseClassName = mergeClasses(
    styles.button,
    /* Desligado troca a variante em vez de se somar a ela: com CSS Module
         o `twMerge` não enxerga o que a classe carrega, então duas tintas
         empilhadas ficariam as duas aplicadas, e venceria a ordem do arquivo
         em vez da intenção. */
    isMuted ? disabledStyle(variant) : variantClasses[variant],
    sizeClasses[size],
    /* Carregando não é desligado: a ação está em curso, então a tinta da
         variante continua e só o conjunto recua. */
    loading && styles.loadingDimmed,
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
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={baseClassName}
      {...props}
    >
      {loadingIndicator === 'dots' ? (
        <LoadingDots visible={loading} />
      ) : (
        <Spinner visible={loading} />
      )}
      {!loading && children}
    </button>
  )
}
