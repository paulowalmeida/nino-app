import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { WEEK_SCHEDULE_DAYS } from '@pages/Settings/constants/settings.constants'

import { WeekScheduleSkeleton } from './WeekScheduleSkeleton'
import { weekScheduleSkeletonMock } from './WeekScheduleSkeleton.mock'

const { placeholderDayCount, placeholderBoneCount } = weekScheduleSkeletonMock

describe('WeekScheduleSkeleton', () => {
  it('announces that the opening hours are loading', () => {
    render(<WeekScheduleSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando os horários'
    )
  })

  it('keeps the week readable while the times are bones', () => {
    // Arrange
    const { container } = render(<WeekScheduleSkeleton />)

    // Act
    const rows = container.querySelectorAll('li')

    // Assert
    WEEK_SCHEDULE_DAYS.forEach((day) => {
      expect(screen.getByText(day)).toBeVisible()
    })
    expect(rows).toHaveLength(placeholderDayCount)
  })

  it('mirrors the switch and both time fields of every day', () => {
    // Arrange
    const { container } = render(<WeekScheduleSkeleton />)

    // Act
    const bones = container.querySelectorAll('[class*="skeleton"]')

    // Assert
    expect(bones).toHaveLength(placeholderBoneCount)
  })
})
