import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { OpeningHours } from '@custom_types/settings'

import { WeekSchedule } from './WeekSchedule'

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

describe('WeekSchedule', () => {
  it('keeps saving disabled while nothing changed', () => {
    renderSchedule(vi.fn())

    expect(saveButton()).toBeDisabled()
  })

  it('enables saving once a day is toggled', async () => {
    renderSchedule(vi.fn())

    await userEvent.click(screen.getByRole('checkbox', { name: 'Segunda' }))

    expect(saveButton()).toBeEnabled()
  })

  /**
   * O conserto: a linha de base tem de avançar quando a API confirma, sem
   * esperar o refetch. No intervalo entre os dois o botão já não está mais
   * `loading` e voltaria a aceitar clique, gravando a mesma coisa de novo.
   * Aqui `hours` nunca muda de propósito — é o refetch que não chegou.
   */
  it('disables saving again right after the API confirms', async () => {
    renderSchedule(vi.fn().mockResolvedValue([]))

    await userEvent.click(screen.getByRole('checkbox', { name: 'Segunda' }))
    await userEvent.click(saveButton())

    await waitFor(() => expect(saveButton()).toBeDisabled())
  })

  it('stays dirty when the batch fails, so it can be retried', async () => {
    renderSchedule(vi.fn().mockRejectedValue(new Error('boom')))

    await userEvent.click(screen.getByRole('checkbox', { name: 'Segunda' }))
    await userEvent.click(saveButton())

    await waitFor(() => expect(saveButton()).toBeEnabled())
  })

  it('sends only the days that actually changed', async () => {
    const onSave = vi.fn().mockResolvedValue([])
    renderSchedule(onSave)

    await userEvent.click(screen.getByRole('checkbox', { name: 'Quarta' }))
    await userEvent.click(saveButton())

    expect(onSave).toHaveBeenCalledWith([
      expect.objectContaining({ dayOfWeek: 3, isOpen: false }),
    ])
  })
})
