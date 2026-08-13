import { Ref, useMemo } from 'react'

import { Portal } from '@ark-ui/react/portal'
import { createListCollection, Select as ArkSelect } from '@ark-ui/react/select'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import { Icon } from '../Icon/Icon'
import { InputSize } from '../Input/Input.types'
import styles from './Select.module.css'

type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type SelectProps = {
  options: SelectOption[]
  placeholder?: string
  size?: InputSize
  error?: boolean
  disabled?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  ref?: Ref<HTMLButtonElement>
}

const sizeClasses: Record<InputSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
}

/**
 * One choice out of a list that stays folded until asked — the field version
 * of `Listbox`.
 *
 * It carries a hidden native `<select>`, so a form submits it and the phone
 * offers its own wheel picker.
 *
 * @param options - What can be picked. `disabled` greys out one entry
 *
 * @param placeholder - Shown while nothing is picked
 *
 * @param size - Height and padding, matching `Input`. Default: `md`
 *
 * @param error - Paints the invalid state
 *
 * @example
 * <FormField label="Forma de pagamento">
 *   <Select options={methods} placeholder="Escolha" onValueChange={setPay} />
 * </FormField>
 */
export function Select({
  options,
  placeholder,
  size = 'md',
  error = false,
  disabled,
  value,
  defaultValue,
  onValueChange,
  className,
  ref,
}: SelectProps) {
  const collection = useMemo(
    () =>
      createListCollection({
        items: options,
        itemToValue: (item) => item.value,
        itemToString: (item) => item.label,
      }),
    [options]
  )

  return (
    <ArkSelect.Root
      collection={collection}
      disabled={disabled}
      value={value !== undefined ? [value] : undefined}
      defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
      onValueChange={({ value: values }) => onValueChange?.(values[0])}
    >
      <ArkSelect.Control>
        <ArkSelect.Trigger
          ref={ref}
          className={mergeClasses(
            styles.field,
            sizeClasses[size],
            error ? styles.fieldInvalid : styles.fieldResting,
            className
          )}
        >
          <ArkSelect.ValueText
            placeholder={placeholder}
            className={styles.placeholder}
          />
          <ArkSelect.Indicator>
            <Icon name="chevron-down" size="sm" className={styles.chevron} />
          </ArkSelect.Indicator>
        </ArkSelect.Trigger>
      </ArkSelect.Control>
      <Portal>
        <ArkSelect.Positioner>
          <ArkSelect.Content className={styles.optionPanel}>
            {options.map((option) => (
              <ArkSelect.Item
                key={option.value}
                item={option}
                className={styles.option}
              >
                <ArkSelect.ItemText>{option.label}</ArkSelect.ItemText>
              </ArkSelect.Item>
            ))}
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
      <ArkSelect.HiddenSelect />
    </ArkSelect.Root>
  )
}
