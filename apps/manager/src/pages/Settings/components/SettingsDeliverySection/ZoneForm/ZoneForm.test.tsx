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
    await user.type(screen.getByLabelText('Taxa (R$)'), '7,50')
    await user.click(screen.getByRole('button', { name: 'Adicionar região' }))

    expect(onAdd).toHaveBeenCalledWith({ name: 'Centro', fee: 7.5 })
  })
})
