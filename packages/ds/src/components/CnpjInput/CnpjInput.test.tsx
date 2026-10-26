import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { CnpjInput } from './CnpjInput'

describe(CnpjInput.name, () => {
  it('masks a CNPJ', async () => {
    render(<CnpjInput aria-label="cnpj" />)
    await userEvent.type(screen.getByLabelText('cnpj'), '12345678000199')
    expect(screen.getByLabelText('cnpj')).toHaveValue('12.345.678/0001-99')
  })
})
