import { describe, expect, it } from 'vitest'
import { storeWeekSchedule } from './storeWeekSchedule.adapter'
import { storeWeekScheduleMock } from './storeWeekSchedule.adapter.mock'

describe('storeWeekSchedule', () => {
  it('returns one closed row for each weekday when there are no hours', () => {
    const result = storeWeekSchedule(
      storeWeekScheduleMock.hours,
      storeWeekScheduleMock.today
    )
    expect(result).toHaveLength(7)
    expect(result[storeWeekScheduleMock.today].timeLabel).toBe('Fechado')
    expect(result[storeWeekScheduleMock.today].isToday).toBe(true)
  })
})
