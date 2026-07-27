import { useId } from 'react'

import { RatingGroup as ArkRating } from '@ark-ui/react/rating-group'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { RatingProps } from './Rating.types'

const baseControl = 'flex items-center gap-1'

const baseItem =
  'cursor-pointer rounded-[4px] text-sand-deep transition-colors ' +
  'outline-none focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:outline-offset-2 data-[highlighted]:text-brand ' +
  'data-[checked]:text-brand disabled:pointer-events-none ' +
  'disabled:opacity-50'

const readOnlyItem =
  'cursor-default text-sand-deep data-[highlighted]:text-brand ' +
  'data-[checked]:text-brand'

function StarIcon({
  half,
  gradientId,
}: {
  half?: boolean
  gradientId: string
}) {
  if (half) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#d1d5db" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${gradientId})`}
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    )
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

export function Rating({
  count = 5,
  value,
  defaultValue = 0,
  onValueChange,
  allowHalf = false,
  readOnly = false,
  disabled,
  name,
  className,
}: RatingProps) {
  const gradientId = useId()

  return (
    <ArkRating.Root
      count={count}
      value={value}
      defaultValue={defaultValue}
      onValueChange={({ value: v }) => onValueChange?.(v)}
      allowHalf={allowHalf}
      readOnly={readOnly}
      disabled={disabled}
      name={name}
    >
      <ArkRating.Control className={mergeClasses(baseControl, className)}>
        <ArkRating.Context>
          {() =>
            Array.from({ length: count }, (_, i) => (
              <ArkRating.Item
                key={i}
                index={i + 1}
                className={readOnly ? readOnlyItem : baseItem}
              >
                <ArkRating.ItemContext>
                  {({ half }) => (
                    <StarIcon half={half} gradientId={gradientId} />
                  )}
                </ArkRating.ItemContext>
              </ArkRating.Item>
            ))
          }
        </ArkRating.Context>
      </ArkRating.Control>
      <ArkRating.HiddenInput />
    </ArkRating.Root>
  )
}

Rating.displayName = 'Rating'
