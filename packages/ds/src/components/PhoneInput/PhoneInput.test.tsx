import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { PhoneInput } from './PhoneInput'

describe(PhoneInput.name, () => {
  it('masks a mobile number', async () => {
    render(<PhoneInput aria-label="phone" />)
    await userEvent.type(screen.getByLabelText('phone'), '11987654321')
    expect(screen.getByLabelText('phone')).toHaveValue('(11) 98765-4321')
  })
})
