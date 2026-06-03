import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { OTPInput } from './OTPInput'

describe(OTPInput.displayName!, () => {
  it('renders 6 inputs by default', () => {
    render(<OTPInput />)
    expect(screen.getAllByRole('textbox')).toHaveLength(6)
  })

  it('renders 4 inputs when length=4', () => {
    render(<OTPInput length={4} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
  })

  it('calls onValueComplete when all fields are filled', async () => {
    const onValueComplete = vi.fn()
    render(<OTPInput length={4} onValueComplete={onValueComplete} />)
    const inputs = screen.getAllByRole('textbox')
    for (const input of inputs) {
      await userEvent.type(input, '1')
    }
    expect(onValueComplete).toHaveBeenCalledWith('1111')
  })

  it('disables all inputs when disabled', () => {
    render(<OTPInput disabled />)
    screen.getAllByRole('textbox').forEach((input) => {
      expect(input).toBeDisabled()
    })
  })
})
