import type { OpeningHours } from '@custom_types/settings'

const minutesOf = (time: string): number => {
  const [hour, minute] = time.split(':').map(Number)
  return hour * 60 + (minute || 0)
}

const nowIn = (timezone: string): { day: number; minutes: number } => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '0'

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return {
    day: days.indexOf(value('weekday')),
    minutes: Number(value('hour')) * 60 + Number(value('minute')),
  }
}

/**
 * Whether the store is taking orders right now, in its own timezone. A shift
 * that closes past midnight (18:00–02:00) still belongs to the day it opened.
 */
export const isStoreOpen = (
  hours: OpeningHours[],
  timezone: string
): boolean => {
  const { day, minutes } = nowIn(timezone)

  const openNow = (entry: OpeningHours, atMinutes: number): boolean => {
    const open = minutesOf(entry.openTime)
    const close = minutesOf(entry.closeTime)
    return close > open
      ? atMinutes >= open && atMinutes < close
      : atMinutes >= open || atMinutes < close
  }

  const today = hours.find(
    ({ dayOfWeek, isOpen }) => dayOfWeek === day && isOpen
  )
  if (today && openNow(today, minutes)) return true

  // madrugada: a faixa que abriu ontem ainda pode estar valendo
  const yesterday = hours.find(
    ({ dayOfWeek, isOpen }) => dayOfWeek === (day + 6) % 7 && isOpen
  )
  if (!yesterday) return false

  const open = minutesOf(yesterday.openTime)
  const close = minutesOf(yesterday.closeTime)

  return close < open && minutes < close
}
