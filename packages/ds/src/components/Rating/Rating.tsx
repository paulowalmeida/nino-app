import { RatingGroup as ArkRating } from '@ark-ui/react/rating-group'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import { Icon } from '../Icon/Icon'
import styles from './Rating.module.css'

type RatingProps = {
  /** How many stars. Default: `5` */
  count?: number
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  /**
   * Lets the rating land on half a star, which is what an average needs: 4.5
   * out of ten reviews is not 4 and is not 5
   */
  allowHalf?: boolean
  /**
   * Shows a rating without taking one. Use it wherever the stars report a
   * result instead of asking for one
   */
  readOnly?: boolean
  disabled?: boolean
  /** Field name, for when the stars are inside a form */
  name?: string
  className?: string
}

/**
 * Star rating — given by the consumer, shown on the store.
 *
 * ```tsx
 * <Rating value={store.rating} allowHalf readOnly />
 * <Rating name="rating" onValueChange={setRating} />
 * ```
 */
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
  return (
    <ArkRating.Root
      count={count}
      value={value}
      defaultValue={defaultValue}
      onValueChange={({ value: rating }) => onValueChange?.(rating)}
      allowHalf={allowHalf}
      readOnly={readOnly}
      disabled={disabled}
      name={name}
    >
      <ArkRating.Control className={mergeClasses(styles.starRow, className)}>
        <ArkRating.Context>
          {() =>
            Array.from({ length: count }, (_, index) => (
              <ArkRating.Item
                key={index}
                index={index + 1}
                className={readOnly ? styles.starStatic : styles.starButton}
              >
                <Icon name="star" size="md" />
                <span className={styles.filledLayer}>
                  <Icon
                    name="star-filled"
                    size="md"
                    className={styles.filledStar}
                  />
                </span>
              </ArkRating.Item>
            ))
          }
        </ArkRating.Context>
      </ArkRating.Control>
      <ArkRating.HiddenInput />
    </ArkRating.Root>
  )
}
