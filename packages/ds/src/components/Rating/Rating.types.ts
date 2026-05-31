export interface RatingProps {
  count?: number
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** Allows clearing the rating by clicking the selected star again */
  allowHalf?: boolean
  readOnly?: boolean
  disabled?: boolean
  name?: string
  className?: string
}
