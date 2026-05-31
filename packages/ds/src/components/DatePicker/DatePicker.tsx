import { CalendarDate, type DateValue } from '@internationalized/date'

import { DatePicker as ArkDatePicker } from '@ark-ui/react/date-picker'
import { Portal } from '@ark-ui/react/portal'

import { DatePickerProps } from './DatePicker.types'

import './DatePicker.css'

function jsToCalendar(d: Date): CalendarDate {
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

function calendarToJs(d: CalendarDate): Date {
  return new Date(d.year, d.month - 1, d.day)
}

const now = new Date()
const defaultMin = new CalendarDate(now.getFullYear() - 10, 1, 1)
const defaultMax = new CalendarDate(now.getFullYear() + 1, 12, 31)

const XIcon = () => (
  <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M18 6 6 18M6 6l12 12' />
  </svg>
)

const ChevronLeft = () => (
  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='m15 18-6-6 6-6' />
  </svg>
)

const ChevronRight = () => (
  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='m9 18 6-6-6-6' />
  </svg>
)

export function DatePicker({
  value,
  onValueChange,
  placeholder = 'dd/mm/aaaa',
  disabled,
  startMonth,
  endMonth,
}: DatePickerProps) {
  const min = startMonth ? jsToCalendar(startMonth) : defaultMin
  const max = endMonth ? jsToCalendar(endMonth) : defaultMax

  return (
    <ArkDatePicker.Root
      className='nino-dp-root'
      value={value ? [jsToCalendar(value)] : []}
      onValueChange={({ value: vals }) => {
        const d = vals[0] as CalendarDate | undefined
        onValueChange?.(d ? calendarToJs(d) : undefined)
      }}
      min={min}
      max={max}
      disabled={disabled}
      locale='pt-BR'
      selectionMode='single'
      closeOnSelect
      openOnClick
      positioning={{ placement: 'bottom', offset: { mainAxis: 4 } }}
    >
      <ArkDatePicker.Control className='nino-dp-control'>
        <ArkDatePicker.Input className='nino-dp-input' placeholder={placeholder} />
        <ArkDatePicker.ClearTrigger className='nino-dp-clear' aria-label='Clear date'>
          <XIcon />
        </ArkDatePicker.ClearTrigger>
      </ArkDatePicker.Control>

      <Portal>
        <ArkDatePicker.Positioner>
          <ArkDatePicker.Content className='nino-dp-content'>

            <ArkDatePicker.View view='day' className='nino-dp-view'>
              <ArkDatePicker.Context>
                {(dp) => (
                  <>
                    <ArkDatePicker.ViewControl className='nino-dp-view-control'>
                      <ArkDatePicker.PrevTrigger className='nino-dp-prev-trigger' aria-label='Previous month'>
                        <ChevronLeft />
                      </ArkDatePicker.PrevTrigger>
                      <ArkDatePicker.ViewTrigger className='nino-dp-view-trigger'>
                        <ArkDatePicker.RangeText />
                      </ArkDatePicker.ViewTrigger>
                      <ArkDatePicker.NextTrigger className='nino-dp-next-trigger' aria-label='Next month'>
                        <ChevronRight />
                      </ArkDatePicker.NextTrigger>
                    </ArkDatePicker.ViewControl>
                    <ArkDatePicker.Table className='nino-dp-table'>
                      <ArkDatePicker.TableHead>
                        <ArkDatePicker.TableRow>
                          {dp.weekDays.map((wd, i) => (
                            <ArkDatePicker.TableHeader key={i} className='nino-dp-table-header'>
                              {wd.short}
                            </ArkDatePicker.TableHeader>
                          ))}
                        </ArkDatePicker.TableRow>
                      </ArkDatePicker.TableHead>
                      <ArkDatePicker.TableBody>
                        {dp.weeks.map((week, wi) => (
                          <ArkDatePicker.TableRow key={wi}>
                            {week.map((day, di) => (
                              <ArkDatePicker.TableCell key={di} value={day as DateValue} className='nino-dp-table-cell'>
                                <ArkDatePicker.TableCellTrigger className='nino-dp-cell-trigger'>
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

            <ArkDatePicker.View view='month' className='nino-dp-view'>
              <ArkDatePicker.Context>
                {(dp) => (
                  <>
                    <ArkDatePicker.ViewControl className='nino-dp-view-control'>
                      <ArkDatePicker.PrevTrigger className='nino-dp-prev-trigger' aria-label='Previous year'>
                        <ChevronLeft />
                      </ArkDatePicker.PrevTrigger>
                      <ArkDatePicker.ViewTrigger className='nino-dp-view-trigger'>
                        <ArkDatePicker.RangeText />
                      </ArkDatePicker.ViewTrigger>
                      <ArkDatePicker.NextTrigger className='nino-dp-next-trigger' aria-label='Next year'>
                        <ChevronRight />
                      </ArkDatePicker.NextTrigger>
                    </ArkDatePicker.ViewControl>
                    <ArkDatePicker.Table className='nino-dp-table'>
                      <ArkDatePicker.TableBody>
                        {dp.getMonthsGrid({ columns: 4, format: 'short' }).map((row, ri) => (
                          <ArkDatePicker.TableRow key={ri}>
                            {row.map((month) => (
                              <ArkDatePicker.TableCell key={month.label} value={month.value as unknown as DateValue} className='nino-dp-table-cell'>
                                <ArkDatePicker.TableCellTrigger className='nino-dp-cell-trigger'>
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

            <ArkDatePicker.View view='year' className='nino-dp-view'>
              <ArkDatePicker.Context>
                {(dp) => (
                  <>
                    <ArkDatePicker.ViewControl className='nino-dp-view-control'>
                      <ArkDatePicker.PrevTrigger className='nino-dp-prev-trigger' aria-label='Previous decade'>
                        <ChevronLeft />
                      </ArkDatePicker.PrevTrigger>
                      <ArkDatePicker.ViewTrigger className='nino-dp-view-trigger'>
                        <ArkDatePicker.RangeText />
                      </ArkDatePicker.ViewTrigger>
                      <ArkDatePicker.NextTrigger className='nino-dp-next-trigger' aria-label='Next decade'>
                        <ChevronRight />
                      </ArkDatePicker.NextTrigger>
                    </ArkDatePicker.ViewControl>
                    <ArkDatePicker.Table className='nino-dp-table'>
                      <ArkDatePicker.TableBody>
                        {dp.getYearsGrid({ columns: 4 }).map((row, ri) => (
                          <ArkDatePicker.TableRow key={ri}>
                            {row.map((year) => (
                              <ArkDatePicker.TableCell key={year.label} value={year.value as unknown as DateValue} className='nino-dp-table-cell'>
                                <ArkDatePicker.TableCellTrigger className='nino-dp-cell-trigger'>
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
