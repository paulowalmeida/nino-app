import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { CpfInput } from './CpfInput'

describe(CpfInput.name, () => {
  it('masks a CPF', async () => {
    render(<CpfInput aria-label="cpf" />)
    await userEvent.type(screen.getByLabelText('cpf'), '12345678901')
    expect(screen.getByLabelText('cpf')).toHaveValue('123.456.789-01')
  })
})
