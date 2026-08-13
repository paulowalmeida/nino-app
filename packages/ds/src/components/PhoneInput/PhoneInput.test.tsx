import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { PhoneInput } from './PhoneInput'

const typeInto = async (digits: string) => {
  render(<PhoneInput aria-label="telefone" />)
  const field = screen.getByLabelText('telefone')
  await userEvent.type(field, digits)
  return field
}

describe(PhoneInput.name, () => {
  it('masks a mobile number', async () => {
    // Arrange / Act
    const field = await typeInto('11987654321')

    // Assert
    expect(field).toHaveValue('(11) 98765-4321')
  })

  it('masks a landline, which is one digit shorter', async () => {
    // Arrange / Act
    const field = await typeInto('1132654321')

    // Assert
    expect(field).toHaveValue('(11) 3265-4321')
  })

  it('stops at eleven digits', async () => {
    // Arrange / Act
    const field = await typeInto('119876543219999')

    // Assert
    expect(field).toHaveValue('(11) 98765-4321')
  })

  it('shows only what was typed so far', async () => {
    // Arrange / Act
    const field = await typeInto('119')

    // Assert
    expect(field).toHaveValue('(11) 9')
  })

  it('ignores letters', async () => {
    // Arrange / Act
    const field = await typeInto('11abc98765')

    // Assert: seven digits still read as a landline, so the dash lands
    // before the last one — only the eleventh digit settles it as mobile
    expect(field).toHaveValue('(11) 9876-5')
  })
})
