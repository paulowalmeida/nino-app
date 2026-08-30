import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import type { StoreWeekScheduleRow } from '@custom_types/store/store-week-schedule-row'

const DAYS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
]

const formatHourMinute = (time: string): string => time.slice(0, 5)

export const storeWeekSchedule = (
  hours: PublicOpeningHours[],
  today: number
): StoreWeekScheduleRow[] =>
  DAYS.map((day, index) => {
    const entry = hours.find((hour) => hour.dayOfWeek === index)

    return {
      day,
      isToday: index === today,
      timeLabel: entry?.isOpen
        ? `${formatHourMinute(entry.openTime)} às ${formatHourMinute(entry.closeTime)}`
        : 'Fechado',
    }
  })
