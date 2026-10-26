import { Ref } from 'react'

import { TagsInput as ArkTagsInput } from '@ark-ui/react/tags-input'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import { Icon } from '../Icon/Icon'
import { InputSize } from '../Input/Input.types'
import styles from './TagsInput.module.css'

type TagsInputProps = {
  /**
   * Controlled tags. Leave it out and pass `defaultValue` to let the
   * component keep its own
   */
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  /** Ceiling on how many chips. Reached it, the field stops taking new ones */
  max?: number
  disabled?: boolean
  error?: boolean
  /** Height and typography, matching `Input`. Default: `md` */
  size?: InputSize
  className?: string
  ref?: Ref<HTMLInputElement>
}

const sizeClasses: Record<InputSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
}

/**
 * Field where each entry becomes a removable chip — categories of an item,
 * e-mails of a team, words that trigger a rule.
 *
 * Enter closes a chip, Backspace on an empty field takes back the last one.
 *
 * ```tsx
 * <FormField label="Categorias">
 *   <TagsInput value={tags} onValueChange={setTags} max={5} />
 * </FormField>
 * ```
 */
export function TagsInput({
  value,
  defaultValue,
  onValueChange,
  placeholder,
  max,
  disabled,
  error = false,
  size = 'md',
  className,
  ref,
}: TagsInputProps) {
  return (
    <ArkTagsInput.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={({ value: tags }) => onValueChange?.(tags)}
      max={max}
      disabled={disabled}
    >
      <ArkTagsInput.Control
        className={mergeClasses(
          styles.field,
          sizeClasses[size],
          error ? styles.fieldInvalid : styles.fieldResting,
          className
        )}
      >
        <ArkTagsInput.Context>
          {(api) =>
            api.value.map((tag, index) => (
              <ArkTagsInput.Item
                key={`${tag}-${index}`}
                index={index}
                value={tag}
              >
                <ArkTagsInput.ItemPreview className={styles.tag}>
                  <ArkTagsInput.ItemText>{tag}</ArkTagsInput.ItemText>
                  <ArkTagsInput.ItemDeleteTrigger
                    className={styles.tagRemoveButton}
                    aria-label={`Remover ${tag}`}
                  >
                    <Icon name="x" size="xs" />
                  </ArkTagsInput.ItemDeleteTrigger>
                </ArkTagsInput.ItemPreview>
                <ArkTagsInput.ItemInput />
              </ArkTagsInput.Item>
            ))
          }
        </ArkTagsInput.Context>
        <ArkTagsInput.Input
          ref={ref}
          placeholder={placeholder}
          className={styles.textInput}
        />
      </ArkTagsInput.Control>
      <ArkTagsInput.HiddenInput />
    </ArkTagsInput.Root>
  )
}
