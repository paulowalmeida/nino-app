import { InputHTMLAttributes, Ref } from 'react'

import { PasswordInput as ArkPasswordInput } from '@ark-ui/react/password-input'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import { Icon } from '../Icon/Icon'
import { InputSize } from '../Input/Input.types'
import styles from './PasswordInput.module.css'

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  size?: InputSize
  error?: boolean
  ref?: Ref<HTMLInputElement>
}

const sizeClasses: Record<InputSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
}

/**
 * Password field with the eye that reveals what was typed.
 *
 * The reveal is not a nicety: on a phone, typing a long password blind is
 * where people give up and reset it. It takes the same props as `Input`, so
 * `register` from react-hook-form drops straight in.
 *
 * @param size - Height and padding. Default: `md`
 *
 * @param error - Paints the invalid state
 *
 * @param ref - Forwarded to the `<input>`, for focus and for form libraries
 *
 * @example
 * <FormField label="Senha" error={errors.password?.message}>
 *   <PasswordInput {...register('password')} />
 * </FormField>
 */
export function PasswordInput({
  size = 'md',
  error = false,
  className,
  disabled,
  ref,
  ...props
}: PasswordInputProps) {
  return (
    <ArkPasswordInput.Root invalid={error} disabled={disabled}>
      <ArkPasswordInput.Control
        className={mergeClasses(
          styles.field,
          error ? styles.fieldInvalid : styles.fieldResting,
          sizeClasses[size],
          className
        )}
      >
        <ArkPasswordInput.Input ref={ref} className={styles.passwordInput} {...props} />
        <ArkPasswordInput.VisibilityTrigger
          className={styles.revealButton}
          aria-label="Mostrar ou ocultar senha"
        >
          <ArkPasswordInput.Indicator fallback={<Icon name="eye" />}>
            <Icon name="eye-off" />
          </ArkPasswordInput.Indicator>
        </ArkPasswordInput.VisibilityTrigger>
      </ArkPasswordInput.Control>
    </ArkPasswordInput.Root>
  )
}
