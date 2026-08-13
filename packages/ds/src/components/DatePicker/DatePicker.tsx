import { FocusEventHandler, Ref } from 'react'

import { DatePicker as ArkDatePicker } from '@ark-ui/react/date-picker'
import { Portal } from '@ark-ui/react/portal'
import { Icon } from '@ds/components/Icon/Icon'
import { CalendarDate, type DateValue } from '@internationalized/date'

import styles from './DatePicker.module.css'

type DatePickerProps = {
  name?: string
  onBlur?: FocusEventHandler<HTMLInputElement>
  /** Points at the text input, which is what takes focus. */
  ref?: Ref<HTMLInputElement>
  value?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  /** Earliest available month in the calendar. Default: 10 years ago */
  startMonth?: Date
  /** Latest available month in the calendar. Default: 1 year ahead */
  endMonth?: Date
}

function jsToCalendar(d: Date): CalendarDate {
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

function calendarToJs(d: CalendarDate): Date {
  return new Date(d.year, d.month - 1, d.day)
}

export function DatePicker({
  name,
  onBlur,
  ref,
  value,
  onValueChange,
  placeholder = 'dd/mm/aaaa',
  disabled,
  startMonth,
  endMonth,
}: DatePickerProps) {
  const now = new Date()
  const min = startMonth
    ? jsToCalendar(startMonth)
    : new CalendarDate(now.getFullYear() - 10, 1, 1)
  const max = endMonth
    ? jsToCalendar(endMonth)
    : new CalendarDate(now.getFullYear() + 1, 12, 31)

  return (
    <ArkDatePicker.Root
      className={styles.datePicker}
      value={value ? [jsToCalendar(value)] : []}
      onValueChange={({ value: vals }) => {
        const d = vals[0] as CalendarDate | undefined
        onValueChange?.(d ? calendarToJs(d) : undefined)
      }}
      min={min}
      max={max}
      disabled={disabled}
      locale="pt-BR"
      selectionMode="single"
      closeOnSelect
      openOnClick
      positioning={{ placement: 'bottom', offset: { mainAxis: 4 } }}
    >
      <ArkDatePicker.Control className={styles.field}>
        <ArkDatePicker.Input
          ref={ref}
          name={name}
          onBlur={onBlur}
          className={styles.dateInput}
          placeholder={placeholder}
        />
        <ArkDatePicker.ClearTrigger
          className={styles.clearButton}
          aria-label="Clear date"
        >
          <Icon name="x" size="xs" />
        </ArkDatePicker.ClearTrigger>
      </ArkDatePicker.Control>

      <Portal>
        <ArkDatePicker.Positioner>
          <ArkDatePicker.Content className={styles.calendarPanel}>
            <ArkDatePicker.View view="day" className={styles.calendarView}>
              <ArkDatePicker.Context>
                {(dp) => (
                  <>
                    <ArkDatePicker.ViewControl className={styles.viewHeader}>
                      <ArkDatePicker.PrevTrigger
                        className={styles.prevMonthButton}
                        aria-label="Previous month"
                      >
                        <Icon name="chevron-left" size="sm" />
                      </ArkDatePicker.PrevTrigger>
                      <ArkDatePicker.ViewTrigger className={styles.viewSwitchButton}>
                        <ArkDatePicker.RangeText />
                      </ArkDatePicker.ViewTrigger>
                      <ArkDatePicker.NextTrigger
                        className={styles.nextMonthButton}
                        aria-label="Next month"
                      >
                        <Icon name="chevron-right" size="sm" />
                      </ArkDatePicker.NextTrigger>
                    </ArkDatePicker.ViewControl>
                    <ArkDatePicker.Table className={styles.dayGrid}>
                      <ArkDatePicker.TableHead>
                        <ArkDatePicker.TableRow>
                          {dp.weekDays.map((wd, i) => (
                            <ArkDatePicker.TableHeader
                              key={i}
                              className={styles.weekdayLabel}
                            >
                              {wd.short}
                            </ArkDatePicker.TableHeader>
                          ))}
                        </ArkDatePicker.TableRow>
                      </ArkDatePicker.TableHead>
                      <ArkDatePicker.TableBody>
                        {dp.weeks.map((week, wi) => (
                          <ArkDatePicker.TableRow key={wi}>
                            {week.map((day, di) => (
                              <ArkDatePicker.TableCell
                                key={di}
                                value={day as DateValue}
                                className={styles.dayCell}
                              >
                                <ArkDatePicker.TableCellTrigger
                                  className={styles.dayButton}
                                >
                                  {(day as CalendarDate).day}
                                </ArkDatePicker.TableCellTrigger>
                              </ArkDatePicker.TableCell>
                            ))}
                          </ArkDatePicker.TableRow>
                        ))}
                      </ArkDatePicker.TableBody>
                    </ArkDatePicker.Table>
                  </>
                )}
              </ArkDatePicker.Context>
            </ArkDatePicker.View>

            <ArkDatePicker.View view="month" className={styles.calendarView}>
              <ArkDatePicker.Context>
                {(dp) => (
                  <>
                    <ArkDatePicker.ViewControl className={styles.viewHeader}>
                      <ArkDatePicker.PrevTrigger
                        className={styles.prevMonthButton}
                        aria-label="Previous year"
                      >
                        <Icon name="chevron-left" size="sm" />
                      </ArkDatePicker.PrevTrigger>
                      <ArkDatePicker.ViewTrigger className={styles.viewSwitchButton}>
                        <ArkDatePicker.RangeText />
                      </ArkDatePicker.ViewTrigger>
                      <ArkDatePicker.NextTrigger
                        className={styles.nextMonthButton}
                        aria-label="Next year"
                      >
                        <Icon name="chevron-right" size="sm" />
                      </ArkDatePicker.NextTrigger>
                    </ArkDatePicker.ViewControl>
                    <ArkDatePicker.Table className={styles.dayGrid}>
                      <ArkDatePicker.TableBody>
                        {dp
                          .getMonthsGrid({ columns: 4, format: 'short' })
                          .map((row, ri) => (
                            <ArkDatePicker.TableRow key={ri}>
                              {row.map((month) => (
                                <ArkDatePicker.TableCell
                                  key={month.label}
                                  value={month.value as unknown as DateValue}
                                  className={styles.dayCell}
                                >
                                  <ArkDatePicker.TableCellTrigger
                                    className={styles.dayButton}
                                  >
                                    {month.label}
                                  </ArkDatePicker.TableCellTrigger>
                                </ArkDatePicker.TableCell>
                              ))}
                            </ArkDatePicker.TableRow>
                          ))}
                      </ArkDatePicker.TableBody>
                    </ArkDatePicker.Table>
                  </>
                )}
              </ArkDatePicker.Context>
            </ArkDatePicker.View>

            <ArkDatePicker.View view="year" className={styles.calendarView}>
              <ArkDatePicker.Context>
                {(dp) => (
                  <>
                    <ArkDatePicker.ViewControl className={styles.viewHeader}>
                      <ArkDatePicker.PrevTrigger
                        className={styles.prevMonthButton}
                        aria-label="Previous decade"
                      >
                        <Icon name="chevron-left" size="sm" />
                      </ArkDatePicker.PrevTrigger>
                      <ArkDatePicker.ViewTrigger className={styles.viewSwitchButton}>
                        <ArkDatePicker.RangeText />
                      </ArkDatePicker.ViewTrigger>
                      <ArkDatePicker.NextTrigger
                        className={styles.nextMonthButton}
                        aria-label="Next decade"
                      >
                        <Icon name="chevron-right" size="sm" />
                      </ArkDatePicker.NextTrigger>
                    </ArkDatePicker.ViewControl>
                    <ArkDatePicker.Table className={styles.dayGrid}>
                      <ArkDatePicker.TableBody>
                        {dp.getYearsGrid({ columns: 4 }).map((row, ri) => (
                          <ArkDatePicker.TableRow key={ri}>
                            {row.map((year) => (
                              <ArkDatePicker.TableCell
                                key={year.label}
                                value={year.value as unknown as DateValue}
                                className={styles.dayCell}
                              >
                                <ArkDatePicker.TableCellTrigger
                                  className={styles.dayButton}
                                >
                                  {year.label}
                                </ArkDatePicker.TableCellTrigger>
                              </ArkDatePicker.TableCell>
                            ))}
                          </ArkDatePicker.TableRow>
                        ))}
                      </ArkDatePicker.TableBody>
                    </ArkDatePicker.Table>
                  </>
                )}
              </ArkDatePicker.Context>
            </ArkDatePicker.View>
          </ArkDatePicker.Content>
        </ArkDatePicker.Positioner>
      </Portal>
    </ArkDatePicker.Root>
  )
}
