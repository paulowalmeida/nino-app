import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Input } from './Input'

describe(Input.name, () => {
  it('renders the input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('forwards placeholder to the input', () => {
    render(<Input placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  it('calls onChange when the value changes', async () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(onChange).toHaveBeenCalled()
  })

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} disabled />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('applies error styles when error is true', () => {
    render(<Input error />)
    expect(screen.getByRole('textbox')).toHaveAttribute('data-invalid')
  })

  it('applies default styles when error is false', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toHaveClass('border-gray-300')
  })

  it.each(['sm', 'md', 'lg'] as const)('renders size %s without errors', (size) => {
    render(<Input size={size} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('forwards ref to the input element', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
