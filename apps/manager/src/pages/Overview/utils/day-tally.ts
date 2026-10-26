import type { DayTally } from '@shared/types/order/day-tally'
import type { Order } from '@shared/types/order/order'

const isToday = (iso: string, timezone: string): boolean => {
  const format = (date: Date) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(date)

  return format(new Date(iso)) === format(new Date())
}

/** Highest revenue first — the bar list reads top to bottom already sorted. */
const byPaymentMethod = (today: Order[]): DayTally['byPaymentMethod'] => {
  const amountByMethod = new Map<Order['paymentMethod'], number>()

  for (const order of today) {
    const current = amountByMethod.get(order.paymentMethod) ?? 0
    amountByMethod.set(order.paymentMethod, current + Number(order.totalAmount))
  }

  return [...amountByMethod.entries()]
    .map(([method, amount]) => ({ method, amount }))
    .sort((a, b) => b.amount - a.amount)
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
    byPaymentMethod: byPaymentMethod(today),
  }
}
