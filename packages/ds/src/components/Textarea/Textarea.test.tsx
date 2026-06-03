import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Textarea } from './Textarea'

describe(Textarea.displayName!, () => {
  it('renders with placeholder', () => {
    render(<Textarea placeholder="Digite aqui" />)
    expect(screen.getByPlaceholderText('Digite aqui')).toBeInTheDocument()
  })

  it('calls onChange on input', async () => {
    const onChange = vi.fn()
    render(<Textarea onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'olá')
    expect(onChange).toHaveBeenCalled()
  })

  it('applies error style when error=true', () => {
    render(<Textarea error aria-label="textarea" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('data-invalid')
  })

  it('does not apply error style by default', () => {
    render(<Textarea aria-label="textarea" />)
    expect(screen.getByRole('textbox')).not.toHaveAttribute('data-invalid')
  })

  it('is disabled when disabled', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
