import { forwardRef } from 'react'

import { TagsInput as ArkTagsInput } from '@ark-ui/react/tags-input'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { TagsInputProps, TagsInputSize } from './TagsInput.types'

const sizeClasses: Record<TagsInputSize, string> = {
  sm: 'min-h-8 text-sm',
  md: 'min-h-10 text-sm',
  lg: 'min-h-12 text-base',
}

const baseControl =
  'flex w-full flex-wrap items-center gap-1.5 rounded-card border bg-surface-sunk px-2 py-1 transition-colors focus-within:ring-2'

const controlDefault =
  'border-transparent focus-within:ring-brand focus-within:border-brand'

const controlError =
  'border-danger focus-within:ring-danger focus-within:border-danger'

const chip =
  'inline-flex items-center gap-1 rounded bg-[color-mix(in_srgb,var(--color-brand)_12%,white)] px-2 py-0.5 text-sm text-brand'

const chipDelete =
  'rounded-full p-0.5 leading-none text-brand/70 transition-colors hover:bg-[color-mix(in_srgb,var(--color-brand)_20%,white)] hover:text-brand'

const baseInput =
  'flex-1 min-w-24 bg-transparent px-1 py-0.5 outline-none placeholder:text-faint disabled:cursor-not-allowed'

/**
 * Tag input field — type and press Enter to create removable chips.
 * Wraps Ark TagsInput. Chips use the tenant brand color.
 *
 * @param value - Controlled tags array
 *
 * @param onValueChange - Fired with the updated tags array
 *
 * @param max - Maximum number of tags
 *
 * @param error - Applies error styling
 *
 * @param size - Height/typography scale. Default: `md`
 */
export const TagsInput = forwardRef<HTMLInputElement, TagsInputProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      placeholder,
      max,
      disabled,
      error = false,
      size = 'md',
      className,
    },
    ref
  ) => (
    <ArkTagsInput.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={({ value: v }) => onValueChange?.(v)}
      max={max}
      disabled={disabled}
    >
      <ArkTagsInput.Control
        className={mergeClasses(
          baseControl,
          sizeClasses[size],
          error ? controlError : controlDefault,
          className
        )}
      >
        <ArkTagsInput.Context>
          {(api) =>
            api.value.map((val, index) => (
              <ArkTagsInput.Item
                key={`${val}-${index}`}
                index={index}
                value={val}
              >
                <ArkTagsInput.ItemPreview className={chip}>
                  <ArkTagsInput.ItemText>{val}</ArkTagsInput.ItemText>
                  <ArkTagsInput.ItemDeleteTrigger
                    className={chipDelete}
                    aria-label={`Remove ${val}`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
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
          className={baseInput}
        />
      </ArkTagsInput.Control>
      <ArkTagsInput.HiddenInput />
    </ArkTagsInput.Root>
  )
)

TagsInput.displayName = 'TagsInput'
