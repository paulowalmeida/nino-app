export interface DatePickerProps {
  value?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  /** Earliest available month in the calendar. Default: 10 years ago */
  startMonth?: Date
  /** Latest available month in the calendar. Default: 1 year ahead */
  endMonth?: Date
}
