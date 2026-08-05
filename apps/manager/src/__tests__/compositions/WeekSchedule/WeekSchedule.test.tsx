import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { OpeningHours } from '@custom_types/settings/opening-hours'
import { WeekSchedule } from '@compositions/WeekSchedule/WeekSchedule'

const week: OpeningHours[] = Array.from({ length: 7 }, (_, day) => ({
  id: `hour-${day}`,
  tenantId: 'tenant-1',
  dayOfWeek: day,
  openTime: '18:00',
  closeTime: '23:00',
  isOpen: true,
}))

const saveButton = () => screen.getByRole('button', { name: /Salvar horários/ })

const renderSchedule = (onSave: () => Promise<unknown>) =>
  render(
    <WeekSchedule
      hours={week}
      isPending={false}
      isSaving={false}
      onSave={onSave}
    />
  )

describe(WeekSchedule.name, () => {
  it('keeps saving disabled while nothing changed', () => {
    // Arrange / Act
    renderSchedule(vi.fn())

    // Assert
    expect(saveButton()).toBeDisabled()
  })

  it('enables saving once a day is toggled', async () => {
    // Arrange
    renderSchedule(vi.fn())

    // Act
    await userEvent.click(screen.getByRole('checkbox', { name: 'Segunda' }))

    // Assert
    expect(saveButton()).toBeEnabled()
  })

  /**
   * The fix: the baseline must advance when the API confirms, without
   * waiting for the refetch. In the gap between the two, the button stops
   * being `loading` and would accept another click, saving the same thing
   * again. Here `hours` never changes on purpose — it's the refetch that
   * hasn't landed.
   */
  it('disables saving again right after the API confirms', async () => {
    // Arrange
    renderSchedule(vi.fn().mockResolvedValue([]))

    // Act
    await userEvent.click(screen.getByRole('checkbox', { name: 'Segunda' }))
    await userEvent.click(saveButton())

    // Assert
    await waitFor(() => expect(saveButton()).toBeDisabled())
  })

  it('stays dirty when the batch fails, so it can be retried', async () => {
    // Arrange
    renderSchedule(vi.fn().mockRejectedValue(new Error('boom')))

    // Act
    await userEvent.click(screen.getByRole('checkbox', { name: 'Segunda' }))
    await userEvent.click(saveButton())

    // Assert
    await waitFor(() => expect(saveButton()).toBeEnabled())
  })

  it('sends only the days that actually changed', async () => {
    // Arrange
    const onSave = vi.fn().mockResolvedValue([])
    renderSchedule(onSave)

    // Act
    await userEvent.click(screen.getByRole('checkbox', { name: 'Quarta' }))
    await userEvent.click(saveButton())

    // Assert
    expect(onSave).toHaveBeenCalledWith([
      expect.objectContaining({ dayOfWeek: 3, isOpen: false }),
    ])
  })
})
