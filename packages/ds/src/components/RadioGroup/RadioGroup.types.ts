export interface RadioOption {
  value: string
  label: string
  /** Supporting line under the label — a price, a delay, a consequence. */
  description?: string
  disabled?: boolean
}

export type RadioGroupVariant = 'default' | 'card'

export interface RadioGroupProps {
  options: RadioOption[]
  /**
   * `card` turns each option into a surface of its own — for choices that
   * carry a description and deserve a bigger touch target.
   */
  variant?: RadioGroupVariant
  orientation?: 'horizontal' | 'vertical'
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  /** Names the group for assistive tech when no visible label points at it. */
  'aria-label'?: string
  /** Id of the visible element that already names the group. */
  'aria-labelledby'?: string
}
