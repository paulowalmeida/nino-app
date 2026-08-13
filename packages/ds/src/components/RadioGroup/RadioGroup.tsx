import { FocusEventHandler, Ref } from 'react'

import { RadioGroup as ArkRadioGroup } from '@ark-ui/react/radio-group'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './RadioGroup.module.css'

type RadioOption = {
  value: string
  label: string
  /** Supporting line under the label — a price, a delay, a consequence. */
  description?: string
  disabled?: boolean
}

type RadioGroupVariant = 'default' | 'card'

type RadioGroupProps = {
  /** Choices, each with `value`, `label` and optional `description` */
  options: RadioOption[]
  /**
   * `card` turns each option into a surface of its own — for choices that
   * carry a description and deserve a bigger touch target.
   */
  variant?: RadioGroupVariant
  /** Stacking direction. Default: `vertical` */
  orientation?: 'horizontal' | 'vertical'
  value?: string
  defaultValue?: string
  /** Fired with the selected value */
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  /** Names the group for assistive tech when no visible label points at it. */
  'aria-label'?: string
  /** Id of the visible element that already names the group. */
  'aria-labelledby'?: string
  onBlur?: FocusEventHandler<HTMLDivElement>
  /**
   * Points at the first option's input — the node a form library focuses
   * when it walks to the first invalid field.
   */
  ref?: Ref<HTMLInputElement>
}

const itemClasses: Record<RadioGroupVariant, string> = {
  default: styles.optionRow,
  card: styles.optionCard,
}

/**
 * Single choice out of a short list.
 *
 * ```tsx
 * <RadioGroup options={[{ value: 'pix', label: 'Pix' }]} />
 *
 * @example
 * <RadioGroup
 *   variant="card"
 *   orientation="horizontal"
 *   options={[
 *     { value: 'DELIVERY', label: 'Entrega', description: 'Chega em ~40 min' },
 *     { value: 'PICKUP', label: 'Retirada', description: 'Você busca na loja'
 * },
 *   ]}
 * />
 *
 * - `variant` — `card` gives each option its own surface. Default: `default`
 * ```
 */
export function RadioGroup({
  options,
  variant = 'default',
  orientation = 'vertical',
  className,
  onValueChange,
  ref,
  ...props
}: RadioGroupProps) {
  const isCard = variant === 'card'

  return (
    <ArkRadioGroup.Root
      className={mergeClasses(
        styles.radioGroup,
        orientation === 'vertical'
          ? styles.stackVertical
          : styles.stackHorizontal,
        className
      )}
      onValueChange={({ value }) => value !== null && onValueChange?.(value)}
      orientation={orientation}
      {...props}
    >
      {options.map((option, index) => (
        <ArkRadioGroup.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={itemClasses[variant]}
        >
          <ArkRadioGroup.ItemControl
            className={mergeClasses(
              styles.radioCircle,
              isCard && styles.radioCircleInCard
            )}
          >
            <ArkRadioGroup.Indicator>
              <span className={styles.selectedDot} />
            </ArkRadioGroup.Indicator>
          </ArkRadioGroup.ItemControl>

          {isCard ? (
            <span className={styles.cardTextBlock}>
              <ArkRadioGroup.ItemText className={styles.cardLabelText}>
                {option.label}
              </ArkRadioGroup.ItemText>
              {option.description && (
                <span className={styles.descriptionText}>
                  {option.description}
                </span>
              )}
            </span>
          ) : (
            <ArkRadioGroup.ItemText className={styles.labelText}>
              {option.label}
            </ArkRadioGroup.ItemText>
          )}

          <ArkRadioGroup.ItemHiddenInput ref={index === 0 ? ref : undefined} />
        </ArkRadioGroup.Item>
      ))}
    </ArkRadioGroup.Root>
  )
}
