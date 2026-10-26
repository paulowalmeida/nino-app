import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { OTPInput } from './OTPInput'

describe(OTPInput.name, () => {
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

  /*
   * `type="alphabetic"` here, not the default `numeric`: Ark renders numeric
   * mode as `<input type="tel">`, and jsdom's `userEvent.paste` never
   * delivers `clipboardData` to that input type — even a clean paste with
   * no invalid characters silently does nothing, before this fix is even
   * involved. `onPaste` is the same handler for every `type`, only the
   * regex changes, so this proves the sanitize-before-validate wiring
   * works without depending on the broken `tel` paste path.
   */
  it('strips non-letter characters from a pasted code', async () => {
    // Arrange
    const onValueComplete = vi.fn()
    render(
      <OTPInput
        length={4}
        type="alphabetic"
        onValueComplete={onValueComplete}
      />
    )
    const [firstInput] = screen.getAllByRole('textbox')

    // Act
    firstInput.focus()
    await userEvent.paste('a-b c1d')

    // Assert
    expect(onValueComplete).toHaveBeenCalledWith('abcd')
  })
})
