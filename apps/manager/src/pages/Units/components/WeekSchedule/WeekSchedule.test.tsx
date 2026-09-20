import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { WeekSchedule } from './WeekSchedule'
import { savedMondayMock } from './WeekSchedule.mock'

const onSave = vi.fn().mockResolvedValue(undefined)

const renderWeek = (hours = [savedMondayMock], isPending = false) =>
  render(
    <WeekSchedule
      hours={hours}
      isPending={isPending}
      isSaving={false}
      onSave={onSave}
    />
  )

describe('WeekSchedule', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the weekly schedule', () => {
    renderWeek([])

    expect(screen.getByText('Quando a unidade abre')).toBeInTheDocument()
  })

  it('lists every day of the week', () => {
    renderWeek([])

    expect(screen.getByLabelText('Domingo')).toBeInTheDocument()
    expect(screen.getByLabelText('Sábado')).toBeInTheDocument()
  })

  it('opens the day that came saved from the API', () => {
    renderWeek()

    expect(screen.getByLabelText('Segunda')).toHaveAttribute(
      'data-state',
      'checked'
    )
    expect(screen.getByLabelText('Terça')).toHaveAttribute(
      'data-state',
      'unchecked'
    )
  })

  it('keeps the save closed until a day changes', () => {
    renderWeek()

    expect(
      screen.getByRole('button', { name: 'Salvar horários' })
    ).toBeDisabled()
  })

  it('sends only the days that changed', async () => {
    renderWeek()

    await userEvent.click(screen.getByLabelText('Terça'))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar horários' }))

    await waitFor(() => expect(onSave).toHaveBeenCalled())
    expect(onSave).toHaveBeenCalledWith([
      expect.objectContaining({ dayOfWeek: 2, isOpen: true }),
    ])
  })

  it('closes the save again once the week is written', async () => {
    renderWeek()

    await userEvent.click(screen.getByLabelText('Terça'))
    const save = screen.getByRole('button', { name: 'Salvar horários' })
    await userEvent.click(save)

    await waitFor(() => expect(save).toBeDisabled())
  })

  it('shows the skeleton until the week arrives', () => {
    renderWeek([], true)

    expect(screen.queryByText('Quando a loja abre')).not.toBeInTheDocument()
  })
})
