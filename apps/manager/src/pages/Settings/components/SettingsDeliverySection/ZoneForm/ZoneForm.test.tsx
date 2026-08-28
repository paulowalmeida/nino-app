import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ZoneForm } from './ZoneForm'
import { zoneFormMock } from './ZoneForm.mock'

describe('ZoneForm', () => {
  it('adds a delivery range', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()

    render(<ZoneForm {...zoneFormMock} onAdd={onAdd} />)

    expect(
      screen.getByRole('button', { name: 'Adicionar faixa' })
    ).toBeDisabled()

    await user.type(screen.getByLabelText('Até (km)'), '5')
    await user.type(screen.getByLabelText('Taxa de entrega (R$)'), '7,50')
    expect(
      screen.getByRole('button', { name: 'Adicionar faixa' })
    ).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Adicionar faixa' }))

    expect(onAdd).toHaveBeenCalledWith({
      maxRadiusKm: 5,
      fee: 7.5,
    })
  })
})
