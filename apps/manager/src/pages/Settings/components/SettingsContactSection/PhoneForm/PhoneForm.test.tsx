import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PhoneForm } from './PhoneForm'
import { phoneFormMock } from './PhoneForm.mock'

describe('PhoneForm', () => {
  it('adds a valid phone number', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()

    render(<PhoneForm {...phoneFormMock} onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Telefone'), '91999999999')
    await user.click(screen.getByRole('button', { name: 'Adicionar telefone' }))

    expect(onAdd).toHaveBeenCalledWith('+5591999999999')
  })
})
