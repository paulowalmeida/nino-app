export interface SliderProps {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  /** Label displayed above the slider */
  label?: string
  /** Shows the current value next to the label */
  showValue?: boolean
  className?: string
}
