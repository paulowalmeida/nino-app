import type { DayTally } from '@custom_types/order/day-tally'
import type { Order } from '@custom_types/order/order'
const isToday = (iso: string, timezone: string): boolean => {
  const format = (date: Date) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(date)

  return format(new Date(iso)) === format(new Date())
}

/**
 * The day as the store counts it: cancelled orders never happened, and the
 * day turns at midnight in the store's own timezone, not the browser's.
 */
export const tallyToday = (orders: Order[], timezone: string): DayTally => {
  const today = orders.filter(
    (order) =>
      order.status !== 'CANCELLED' && isToday(order.createdAt, timezone)
  )

  const revenue = today.reduce(
    (total, order) => total + Number(order.totalAmount),
    0
  )

  return {
    orders: today.length,
    revenue,
    average: today.length > 0 ? revenue / today.length : 0,
  }
}
