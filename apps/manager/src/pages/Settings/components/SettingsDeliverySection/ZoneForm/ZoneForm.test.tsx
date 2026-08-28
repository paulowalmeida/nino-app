import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ZoneForm } from './ZoneForm'
import { zoneFormMock } from './ZoneForm.mock'

describe('ZoneForm', () => {
  it('adds a named delivery region', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()

    render(<ZoneForm {...zoneFormMock} onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Nome da região'), 'Centro')
    await user.type(screen.getByLabelText('Até (km)'), '5')
    await user.type(screen.getByLabelText('Taxa (R$)'), '7,50')
    await user.click(screen.getByRole('button', { name: 'Adicionar faixa' }))

    expect(onAdd).toHaveBeenCalledWith({
      name: 'Centro',
      minRadiusKm: 0,
      maxRadiusKm: 5,
      fee: 7.5,
    })
  })
})
