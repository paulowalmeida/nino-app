import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { NumberInput } from './NumberInput'

describe(NumberInput.displayName!, () => {
  it('renders the input', () => {
    render(<NumberInput />)
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  it('reflects the initial value', () => {
    render(<NumberInput defaultValue={42} />)
    expect(screen.getByRole('spinbutton')).toHaveValue(42)
  })

  it('calls onValueChange on input', async () => {
    const onValueChange = vi.fn()
    render(<NumberInput defaultValue={5} onValueChange={onValueChange} />)
    await userEvent.clear(screen.getByRole('spinbutton'))
    await userEvent.type(screen.getByRole('spinbutton'), '10')
    expect(onValueChange).toHaveBeenCalled()
  })

  it('is disabled when disabled', () => {
    render(<NumberInput disabled />)
    expect(screen.getByRole('spinbutton')).toBeDisabled()
  })

  it('applies error styling when error=true', () => {
    render(<NumberInput error />)
    expect(screen.getByRole('spinbutton')).toHaveClass('border-danger')
  })
})
